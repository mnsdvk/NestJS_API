import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from '../transaction.service';
import { BrandConfigService } from '../../brandConfig/brandConfig.service';
import { BrandRevenueSourceService } from '../../brandRevenueSource/brand.revenue.source.service';
import { RemitterService } from '../../remitter/remitter.service';
import { KafkaService } from '../../../utils/kafka/kafka.service';
import { NotFoundException } from '@nestjs/common';

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let brandConfigServiceMock: any;
  let brandRevenueSourceServiceMock: Partial<Record<keyof BrandRevenueSourceService, jest.Mock<any, any>>>;
  let remitterServiceMock: Partial<Record<keyof RemitterService, jest.Mock<any, any>>>;
  let kafkaServiceMock: Partial<Record<keyof KafkaService, jest.Mock<any, any>>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: BrandConfigService,
          useValue: {
            getOneByWhere: jest.fn(),
          },
        },
        {
          provide: BrandRevenueSourceService,
          useValue: {
            findCustomRevenueSource: jest.fn(),
          },
        },
        {
          provide: RemitterService,
          useValue: {
            findRemitter: jest.fn(),
          },
        },
        {
          provide: KafkaService,
          useValue: {
            produce: jest.fn(),
          },
        },
      ],
    }).compile();

    transactionService = module.get<TransactionService>(TransactionService);
    brandConfigServiceMock = module.get<BrandConfigService>(BrandConfigService);
    brandRevenueSourceServiceMock =
      module.get<Partial<Record<keyof BrandRevenueSourceService, jest.Mock<any, any>>>>(BrandRevenueSourceService);
    remitterServiceMock = module.get<Partial<Record<keyof RemitterService, jest.Mock<any, any>>>>(RemitterService);
    kafkaServiceMock = module.get<Partial<Record<keyof KafkaService, jest.Mock<any, any>>>>(KafkaService);
  });

  it('should retrigger transaction processing', async () => {
    // Arrange
    const mockBody = {
      vendorId: 'vendorId',
      transactionId: 'transactionId',
      brandCode: 'brandCode',
    };
    const mockTransaction = {
      id: 'transactionId',
      revenueSourceEntity: 'revenueSourceEntity',
      revenueSource: 'UNKNOWN',
    };
    brandConfigServiceMock.getOneByWhere.mockResolvedValue({});
    brandRevenueSourceServiceMock.findCustomRevenueSource.mockResolvedValue('revenueSourceCode');
    remitterServiceMock.findRemitter.mockResolvedValue('remitterCode');
    kafkaServiceMock.produce.mockResolvedValue(undefined);

    // Act
    await transactionService.retriggerTransactionPg(mockBody);

    // Assert
    expect(brandConfigServiceMock.getOneByWhere).toHaveBeenCalledWith({
      brandCode: mockBody.brandCode,
      vendorId: mockBody.vendorId,
      isArchived: false,
    });
    expect(remitterServiceMock.findRemitter).toHaveBeenCalledWith(mockTransaction.revenueSourceEntity.trim());
    expect(kafkaServiceMock.produce).toHaveBeenCalledWith({
      topic: expect.any(String),
      messages: [{ value: expect.any(String) }],
    });
  });

  it('should throw NotFoundException when transaction is not found', async () => {
    // Arrange
    const mockBody = {
      vendorId: 'vendorId',
      transactionId: 'transactionId',
      brandCode: 'brandCode',
    };
    const mockTransaction = {
      id: 'transactionId',
      revenueSourceEntity: 'revenueSourceEntity',
      revenueSource: 'UNKNOWN',
    };
    brandConfigServiceMock.getOneByWhere.mockResolvedValue({});
    brandRevenueSourceServiceMock.findCustomRevenueSource.mockResolvedValue('revenueSourceCode');
    remitterServiceMock.findRemitter.mockResolvedValue('remitterCode');
    kafkaServiceMock.produce.mockResolvedValue(undefined);

    // Act & Assert
    await expect(transactionService.retriggerTransactionPg(mockBody)).rejects.toThrow(NotFoundException);
  });
});

// Call the getById method
//mockTransactionEntityRepository.findOne = jest.fn().mockImplementationOnce(()=>mockTransactionEntity);

// import { TransactionService } from './transaction.service';
// import { NotFoundException } from '@nestjs/common';

// describe('TransactionService', () => {
//   let transactionService: TransactionService;

//   beforeEach(() => {
//     // Initialize the TransactionService and mock any dependencies such as logger, brandConfigService, _brandRevenueSourceService, etc.
//     transactionService = new TransactionService(/* pass mocked dependencies here */);
//   });

//   it('should return empty transactions and isPgFlow=false when no collections are found', async () => {
//     // Arrange
//     const collection = {
//       CMSGenericInboundResponse: {
//         Header: {
//           RequestID: 'request_id',
//         },
//         CMSGenericInboundRes: {
//           CollectionDetails: {
//             CollectionDetail: [],
//           },
//         },
//       },
//     };

//     // Act
//     const result = await transactionService.collectionToTransaction(collection);

//     // Assert
//     expect(result.transactions).toEqual([]);
//     expect(result.isPgFlow).toBe(false);
//   });

//   it('should return transactions and isPgFlow=true when collections are found', async () => {
//     // Arrange
//     const collection = {
//       CMSGenericInboundResponse: {
//         Header: {
//           RequestID: 'request_id',
//         },
//         CMSGenericInboundRes: {
//           CollectionDetails: {
//             CollectionDetail: [
//               {
//                 Utr_No: 'utr_no_1',
//                 E_Coll_Acc_No: 'acc_no_1',
//                 Amount: 100,
//                 Txn_Ref_No: 'txn_ref_no_1',
//                 Txn_Date: '2024-03-01',
//                 Remit_Name: 'remit_name_1',
//               },
//               // Add more collection objects if needed
//             ],
//           },
//         },
//       },
//     };

//     // Mock any dependencies if needed

//     // Act
//     const result = await transactionService.collectionToTransaction(collection);

//     // Assert
//     expect(result.transactions.length).toBeGreaterThan(0);
//     expect(result.isPgFlow).toBe(true);

//     // Add more assertions based on the expected behavior
//   });

//   // Add more test cases to cover other scenarios
// });

// describe('softDeleteById', () => {
//     it('should soft delete a payout by ID', async () => {

//         mockPayoutEntityRepository.findOne = jest.fn().mockImplementationOnce(()=>mockPayoutEntity);

//                 await payoutRepository.softDeleteById('pay-cashfree-0055');

//     // Expectations

//     expect(mockPayoutEntityRepository.findOne).toHaveBeenCalledWith({
//         where: { id: 'pay-cashfree-0055' },
//         select: undefined,
//     });;
//     expect(mockPayoutEntityRepository.update).toHaveBeenCalledWith(
//         { id: 'pay-cashfree-0055' },
//         { isArchived: true},
//     );
//     });

//     it('should throw NotFoundException if payout with given ID does not exist', async () => {
//     //id='1'
//     // Mocking the getById method of the repository to return null (transaction not found)
//     mockPayoutEntityRepository.findOne.mockResolvedValueOnce(null);

//     // Expecting the softDeleteById method to throw a NotFoundException
//     await expect(payoutRepository.softDeleteById('pay-cashfree-0055')).rejects.toThrow(NotFoundException);

//     // Expectations
//     //expect(mockPayoutEntityRepository.findOne).toHaveBeenCalledTimes(1);
//     expect(mockPayoutEntityRepository.findOne).toHaveBeenCalledWith({
//         where: { id: 'pay-cashfree-0055' },
//         select: undefined,
//     });;
//     expect(mockPayoutEntityRepository.update).not.toHaveBeenCalled();
//     });

// const updatePayoutStatusByIdMock = jest.fn().mockResolvedValueOnce({

//             affected: 1, // Mock that one record was updated
//             raw: {}, // Mock the raw response
//         });
//         payoutService['_payoutRepository'].updatePayoutStatusById = updatePayoutStatusByIdMock;

//         const  softDeleteByIdMock =jest.fn().mockRejectedValue(new NotFoundException()),
//         payoutService['_payoutRepository'].softDeleteById= softDeleteByIdMock;

// });

//payout repository-test

//ERROR in repository file
//   describe('getPayoutsRevenueSourceByBrandCode', () => {
//     it('should return revenue sources for payouts by brand code', async () => {
//       // Mock data
//       const mockBrandCode = 'mock_brand_code';
//       const mockRecords = [{ revenueSource: 'revenue_source_1' }, { revenueSource: 'revenue_source_2' }];
//       const queryBuilderMock = {
//        // select: jest.fn().mockReturnThis(),
//         where: jest.fn().mockReturnThis(),
//         andWhere: jest.fn().mockReturnThis(),
//         distinctOn: jest.fn().mockReturnThis(),
//         getMany: jest.fn().mockResolvedValue(mockRecords),
//       };

//       mockPayoutEntityRepository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilderMock);

//       // Call the method
//       const result = await payoutRepository.getPayoutsRevenueSourceByBrandCode(mockBrandCode);

//       // Expectations
//       expect(mockPayoutEntityRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
//       expect(mockPayoutEntityRepository.createQueryBuilder).toHaveBeenCalledWith('payout');
//       //expect(queryBuilderMock.select).toHaveBeenCalledWith('payout.revenueSource');
//       expect(queryBuilderMock.where).toHaveBeenCalledWith('payout.isArchived = :isArchived', { isArchived: false });
//       expect(queryBuilderMock.andWhere).toHaveBeenCalledWith('payout.brandCode = :brandCode', { brandCode: mockBrandCode });
//       expect(queryBuilderMock.distinctOn).toHaveBeenCalledWith(['payout.revenueSource']);
//       expect(result).toEqual({ revenueSource: ['revenue_source_1', 'revenue_source_2'] });
//     });

//     it('should throw NotFoundException if no records are found', async () => {
//       // Mock data
//       const mockBrandCode = 'mock_brand_code';

//       // Mock repository behavior
//       const queryBuilderMock = {
//         // Mocking getMany to return an empty array
//         getMany: jest.fn().mockResolvedValue([]),
//       };
//       mockPayoutEntityRepository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilderMock);

//       // Call the method and expect it to throw NotFoundException
//       await expect(payoutRepository.getPayoutsRevenueSourceByBrandCode(mockBrandCode)).rejects.toThrow(NotFoundException);
//     });
//   });
