import { PayoutRepository } from '../payout.repository';
import { Any, Repository } from 'typeorm';
import { PayoutEntity } from '../payout.entity';
import { CreatePayoutDto } from '../dto/CreatePayoutDto';
import { PayoutPageDto } from '../dto/PayoutPageDto';
import { PayoutDto } from '../dto/PayoutDto';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { In } from 'typeorm';
import { IsNull } from 'typeorm';
import { PayoutService } from '../payout.service';
import { PageMetaDto } from '../../../common/dto/PageMetaDto';
import { SinglePayoutPageDto } from '../dto/SinglePayoutPageDto';
import { Buffer } from 'buffer';
import { StatusInputDto } from '../dto/StatusInputDto';
import { BadRequestException } from '@nestjs/common';
import { IBrandTransactionObj } from '../../../../../common/types/BrandTransaction.types';
import { Logger } from 'typedoc';
import { AwsClientService } from '../../../shared/services/aws.service';
import { ExcelGeneratorService } from '../../../shared/services/excel-generator.service';
import { KafkaService } from '../../../utils/kafka/kafka.service';
import { SplitConfigService } from '../../../modules/splitConfig/split.config.service';
import { VendorConfigService } from '../../../modules/vendorConfig/vendor.config.service';
import { RevenueSourceService } from '../../../modules/revenueSource/revenue.source.service';
import { BrandConfigService } from '../../../modules/brandConfig/brandConfig.service';
import { BrandConfigViewService } from '../../brandConfigView/brandConfigView.service';
import GrowthBookService from '../../../shared/services/growthbook.service';
import { ConfigService } from '../../../shared/services/config.service';
import graphqlService from '../../../../../common/services/GraphQL.service';

const createPayoutDto: CreatePayoutDto = {
  //const createPayoutDto = {
  id: '7502c512-d622-420a-9d85-809a24b0b9fd',
  createdAt: '2024-03-04T12:00:00Z',
  updatedAt: '2024-03-04T12:00:00Z',
  payoutId: 'pay-cashfree-0055',
  applicationCode: 'APP45874',
  dealCode: 'mock_deal_code',
  beneficiaryCode: '8744578',
  brandCode: 'BC887421',
  vendor: 'cashfree',
  payoutAmount: 1000.0,
  transferAmount: 950.0,
  data: { key: 'value' },
  message: 'mock_message',
  narration: 'mock_narration',
  status: 'mock_status',
  revenueSource: 'mock_revenue_source',
  referenceNumber: 'mock_reference_number',
  revenueSourceEntity: 'mock_revenue_source_entity',
  vendorTransactionId: 'mock_vendor_transaction_id',
  amountInPaisa: 100000,
  amountReversed: 0,
  transferId: 'mock_transfer_id',
  createdBy: 'mock_created_by',
  updatedBy: 'mock_updated_by',
  isArchived: false,
  isReconciled: true,
  settlementTime: new Date('2024-03-04T12:00:00Z'),
  loanCode: 'mock_loan_code',
  tenantCode: 'mock_tenant_code',
  splitMethod: 'mock_split_method',
};

const mockPageMetaDto = {
  length: 10,
  took: 100,
  total: 1000,
};

//mock for payoutdto
const mockPayoutDto = {
  payoutId: 'P001',
  applicationCode: 'A001',
  dealCode: 'D001',
  beneficiaryCode: 'B001',
  brandCode: 'B001',
  vendor: 'Vendor X',
  payoutAmount: 1000,
  transferAmount: 950,
  data: { key: 'value' },
  message: 'Payout successful',
  narration: 'Payout for invoice',
  status: 'SUCCESS',
  revenueSource: 'Source A',
  revenueSourceEntity: 'Entity A',
  vendorTransactionId: 'T001',
  amountInPaisa: 100000,
  amountReversed: 0,
  transferId: 'TR001',
  createdBy: 'User A',
  updatedBy: 'User B',
  isArchived: false,
  isReconciled: true,
  settlementTime: new Date(),
  referenceNumber: 'REF001',
  loanCode: 'L001',
  tenantCode: 'IN',
};

// Mock for PayoutPageDto
const mockPayoutPageDto = new PayoutPageDto({
  data: [
    {
      payoutId: 'P001',
      applicationCode: 'A001',
      dealCode: 'D001',
      beneficiaryCode: 'B001',
      brandCode: 'B001',
      vendor: 'Vendor X',
      payoutAmount: 1000,
      transferAmount: 950,
      data: { key: 'value' },
      message: 'Payout successful',
      narration: 'Payout for invoice',
      status: 'SUCCESS',
      revenueSource: 'Source A',
      revenueSourceEntity: 'Entity A',
      vendorTransactionId: 'T001',
      amountInPaisa: 100000,
      amountReversed: 0,
      transferId: 'TR001',
      createdBy: 'User A',
      updatedBy: 'User B',
      isArchived: false,
      isReconciled: true,
      settlementTime: new Date(),
      referenceNumber: 'REF001',
      loanCode: 'L001',
      tenantCode: 'IN',
    },
  ],
});

//const payoutEntity: PayoutEntity = {} as any;
const mockPayoutEntity = {
  payoutId: 'pay-cashfree-0055',
  applicationCode: 'APP45874',
  beneficiaryCode: '8744578',
  brandCode: 'BC887421',
  vendor: 'cashfree',
  payoutAmount: 758,
  transferAmount: 1588,
  data: '{}',
  message: 'initiated',
  narration: 'inserting payout 0055',
  status: 'INITIATED',
  revenueSource: 'AMAZON',
  revenueSourceEntity: 'AMAZON',
  vendorTransactionId: '4545454478aah',
  createdBy: '4558-8874aa',
  updatedBy: '4558-8874aa',
  isArchived: false,
  amountInPaisa: 100000,
  transferId: 'TRANSFER456',
  amountReversed: 0,
  isReconciled: true,
  settlementTime: new Date('2024-03-04T12:00:00Z'),
  referenceNumber: 'REF123',
  isMigrated: false,
  loanCode: 'LOAN789',
  tenantCode: 'IN',
  dtoClass: PayoutDto,
};
const mockUpdateResult: UpdateResult = {
  raw: {},
  affected: 1,
  generatedMaps: [{ key: 'value' }],
};

describe('PayoutService', () => {
  let _payoutRepository: PayoutRepository;
  let _awsLambdaService: AwsClientService;
  let _configService: ConfigService;
  let _excelGenerator: ExcelGeneratorService;
  let _kafkaService: KafkaService;
  let _splitConfigService: SplitConfigService;
  let _vendorConfigService: VendorConfigService;
  let _brandConfigService: BrandConfigService;
  let _revenueSourceService: RevenueSourceService;
  let _brandConfigViewService: BrandConfigViewService;
  let _growthbookService: GrowthBookService;
  let payoutService: PayoutService;
  let configServiceMock: ConfigService;
  let _logger: Logger;

  const LoggerMock = {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  };

  const PayoutRepositoryMock = {
    getPayoutByBrandCodeAndPayoutId: jest.fn(),
    createPayout: jest.fn(),
    getById: jest.fn(),
    getPayoutsByBrandCode: jest.fn(),
    updatePayoutStatusById: jest.fn(),
    getPayoutsByBrandCodeAndVendor: jest.fn(),
    getPayoutsByStatusArrayAndVendor: jest.fn(),
    softDeleteById: jest.fn(),
    updatePayout: jest.fn(),
    updatePayoutSettlementTime: jest.fn(),
    getPayoutsByTransactionIdAndBrandCode: jest.fn(),
    getPayoutsByTransferIdAndBrandCode: jest.fn(),
    update: jest.fn(),
    findByPayoutId: jest.fn(),
    updatePayoutByPayoutId: jest.fn(),
    fetchPayoutsBrandCodeStatusCondition: jest.fn(),
    getPayoutsRevenueSourceByBrandCode: jest.fn(),
    fetchPayoutsTotalAmount: jest.fn(),
    getAllPayoutsByBrandCode: jest.fn(),
    getAllPayoutsByApplicationCode: jest.fn(),
    updatePayoutStatusByPayoutIds: jest.fn(),
    getAllPayoutsByApplicationCodeGroupByRevenueSourceAndVendor: jest.fn(),
  };
  const KafkaServiceMock = {
    //produce: jest.fn(),
    produce: jest.fn().mockResolvedValue(Any),
  };
  const ConfigServiceMock = {
    get: jest.fn(),
  };
  const AwsClientServiceMock = {
    trigger: jest.fn(),
  };
  const ExcelGeneratorServiceMock = {
    downloadExcel: jest.fn(),
  };
  class SplitConfigServiceMock {}
  class VendorConfigServiceMock {}
  class BrandConfigServiceMock {}
  class RevenueSourceServiceMock {}
  class BrandConfigViewServiceMock {}
  const GrowthBookServiceMock = {
    getFeautureValue: jest.fn(),
  };

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        PayoutService,
        { provide: PayoutRepository, useValue: PayoutRepositoryMock },
        { provide: AwsClientService, useValue: AwsClientServiceMock },
        { provide: ConfigService, useValue: ConfigServiceMock },
        { provide: ExcelGeneratorService, useValue: ExcelGeneratorServiceMock },
        { provide: KafkaService, useValue: KafkaServiceMock },
        { provide: SplitConfigService, useClass: SplitConfigServiceMock },
        { provide: VendorConfigService, useClass: VendorConfigServiceMock },
        { provide: BrandConfigService, useClass: BrandConfigServiceMock },
        { provide: RevenueSourceService, useClass: RevenueSourceServiceMock },
        { provide: BrandConfigViewService, useClass: BrandConfigViewServiceMock },
        { provide: GrowthBookService, useValue: GrowthBookServiceMock },
        { provide: Logger, useValue: LoggerMock },
      ],
    }).compile();

    payoutService = app.get<PayoutService>(PayoutService);
    _payoutRepository = app.get<PayoutRepository>(PayoutRepository);
    _awsLambdaService = app.get<AwsClientService>(AwsClientService);
    _configService = app.get<ConfigService>(ConfigService);
    _excelGenerator = app.get<ExcelGeneratorService>(ExcelGeneratorService);
    _kafkaService = app.get<KafkaService>(KafkaService);
    _splitConfigService = app.get<SplitConfigService>(SplitConfigService);
    _vendorConfigService = app.get<VendorConfigService>(VendorConfigService);
    _brandConfigService = app.get<BrandConfigService>(BrandConfigService);
    _revenueSourceService = app.get<RevenueSourceService>(RevenueSourceService);
    _brandConfigViewService = app.get<BrandConfigViewService>(BrandConfigViewService);
    _growthbookService = app.get<GrowthBookService>(GrowthBookService);
    _logger = app.get<Logger>(Logger);

    jest.clearAllMocks();
  });

  describe('Methods', () => {
    it('Expect PayoutService to be defined.', () => {
      expect(payoutService).toBeDefined();
    });

    describe('getAll', () => {
      it('should return all payouts', async () => {
        _payoutRepository.getAllPayouts = jest.fn().mockImplementation(() => []);
        const allPayouts = await payoutService.getAll({});
        console.log(allPayouts);
        expect(allPayouts).toBeDefined();
      });
      //unit
      it('should handle invalid query parameters', async () => {
        const invalidQuery = { invalidField: 'invalidValue' };

        try {
          await payoutService.getAll(invalidQuery);
        } catch (error) {
          expect(error.message).toBe('Invalid query parameters');
          expect(error.status).toEqual(400);
        }
      });
    });

    describe('create', () => {
      it('should create a new payout successfully', async () => {
        PayoutRepositoryMock.getPayoutByBrandCodeAndPayoutId.mockResolvedValue(null);
        PayoutRepositoryMock.createPayout.mockResolvedValue(mockPayoutEntity);

        // Mock the GrowthBookService to return the feature flag
        GrowthBookServiceMock.getFeautureValue.mockResolvedValue('mock_feature');
        const result = await payoutService.create(createPayoutDto);

        expect(PayoutRepositoryMock.getPayoutByBrandCodeAndPayoutId).toHaveBeenCalledWith(
          createPayoutDto.payoutId,
          createPayoutDto.brandCode,
        );
        expect(PayoutRepositoryMock.createPayout).toHaveBeenCalledWith(createPayoutDto);
        expect(result).toEqual(
          new SinglePayoutPageDto({
            data: mockPayoutEntity,
            meta: new PageMetaDto({}),
          }),
        );
        expect(result).toBeDefined();
      });
    });

    describe('getPayoutById', () => {
      it('should return the payout by id', async () => {
        const payoutId = 'mockPayoutId';
        PayoutRepositoryMock.getById.mockResolvedValue(mockPayoutEntity);

        const result = await payoutService.getPayoutById(payoutId);

        expect(PayoutRepositoryMock.getById).toHaveBeenCalledWith(payoutId);
        expect(result).toEqual(
          new SinglePayoutPageDto({
            data: mockPayoutEntity,
            meta: new PageMetaDto({}),
          }),
        );
      });
      jest.clearAllMocks();
    });
    describe('getPayoutsByBrandCode', () => {
      it('should retrieve transactions by brand code', async () => {
        const brandCode = 'B001';
        const query = {};

        const expectedPayouts: PayoutPageDto = mockPayoutPageDto;

        // Mocking the repository method to return the expected result
        PayoutRepositoryMock.getPayoutsByBrandCode.mockResolvedValue(expectedPayouts);

        // Call the method being tested
        const result = await payoutService.getPayoutsByBrandCode(brandCode, query);

        // Assertions
        expect(result).toEqual(expectedPayouts);
        expect(PayoutRepositoryMock.getPayoutsByBrandCode).toHaveBeenCalledWith(brandCode, query);
        expect(Array.isArray(result.data)).toBe(true);
        expect(result.message).toMatch(/OK/);
        expect(PayoutRepositoryMock.getPayoutsByBrandCode).toHaveBeenCalledTimes(1);
      });
    });

    describe('downloadPayoutsExcelByBrandCode', () => {
      it('should download payouts excel by brand code', async () => {
        const brandCode = 'B001';
        const query = {};
        PayoutRepositoryMock.getPayoutsByBrandCode.mockResolvedValue(mockPayoutPageDto);
        ExcelGeneratorServiceMock.downloadExcel.mockResolvedValue(Buffer.from('Dummy Excel Data'));

        const result = await payoutService.downloadPayoutsExcelByBrandCode(brandCode, query);

        expect(PayoutRepositoryMock.getPayoutsByBrandCode).toHaveBeenCalledWith(brandCode, query);
        expect(ExcelGeneratorServiceMock.downloadExcel).toHaveBeenCalledWith(mockPayoutPageDto.data, 'PAYOUTS');
        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(Buffer);
      });
    });

    describe('updatePayoutStatusById', () => {
      it('should update payout status by ID', async () => {
        const mockPayoutEntity = {
          payoutId: 'pay-cashfree-0055',
          applicationCode: 'APP45874',
          beneficiaryCode: '8744578',
          brandCode: 'BC887421',
          vendor: 'cashfree',
          payoutAmount: 758,
          transferAmount: 1588,
          data: '{}',
          message: 'initiated',
          narration: 'inserting payout 0055',
          status: 'INITIATED',
          revenueSource: 'AMAZON',
          revenueSourceEntity: 'AMAZON',
          vendorTransactionId: '4545454478aah',
          createdBy: '4558-8874aa',
          updatedBy: '4558-8874aa',
          isArchived: false,
          amountInPaisa: 100000,
          transferId: 'TRANSFER456',
          amountReversed: 0,
          isReconciled: true,
          settlementTime: new Date('2024-03-04T12:00:00Z'),
          referenceNumber: 'REF123',
          isMigrated: false,
          loanCode: 'LOAN789',
          tenantCode: 'IN',
          dtoClass: PayoutDto,
        };

        PayoutRepositoryMock.getById.mockResolvedValue(mockPayoutEntity);
        PayoutRepositoryMock.updatePayoutStatusById.mockResolvedValue(createPayoutDto);

        // Call the method
        const result = await payoutService.updatePayoutStatusById(createPayoutDto);

        expect(PayoutRepositoryMock.getById).toHaveBeenCalledWith(createPayoutDto.id); // <--
        expect(PayoutRepositoryMock.updatePayoutStatusById).toHaveBeenCalledWith(createPayoutDto);
        expect(result).toBeDefined();
      });

      it('should throw NotFoundException if payout not found', async () => {
        PayoutRepositoryMock.getById.mockResolvedValue(null);
        // Call the method and expect it to throw NotFoundException
        await expect(payoutService.updatePayoutStatusById(createPayoutDto)).rejects.toThrow(NotFoundException);

        // Assert that getById method was called with the correct argument
        expect(PayoutRepositoryMock.getById).toHaveBeenCalledWith(createPayoutDto.id);
      });
    });

    describe('getPayoutsByBrandCodeAndVendor', () => {
      it('should get payout by BrandCode and Vendor', async () => {
        const status = 'SUCCESS';
        const vendor = 'Vendor X';

        PayoutRepositoryMock.getPayoutsByBrandCodeAndVendor.mockResolvedValue(mockPayoutPageDto);

        const result = await payoutService.getPayoutsByBrandCodeAndVendor(status, vendor);

        expect(PayoutRepositoryMock.getPayoutsByBrandCodeAndVendor).toHaveBeenCalledWith(status, vendor);
        expect(result).toBeDefined();
        expect(result).toEqual(mockPayoutPageDto);
        expect(Array.isArray(result.data)).toBe(true);
        expect(result.message).toMatch(/OK/);
      });
    });
    describe('getPayoutsByStatusArrayAndVendor', () => {
      it('should get payout by statusArray and Vendor', async () => {
        const mockStatusInputDto: StatusInputDto = {
          statuses: ['status1', 'status2'],
          vendor: 'VendorName',
        };

        PayoutRepositoryMock.getPayoutsByStatusArrayAndVendor.mockResolvedValue(mockPayoutPageDto);

        const result = await payoutService.getPayoutsByStatusArrayAndVendor(mockStatusInputDto);

        expect(PayoutRepositoryMock.getPayoutsByStatusArrayAndVendor).toHaveBeenCalledWith(mockStatusInputDto);
        expect(result).toBeDefined();
        expect(result).toEqual(mockPayoutPageDto);
        expect(Array.isArray(result.data)).toBe(true);
        expect(result.message).toMatch(/OK/);
      });
    });

    describe('deletePayoutById', () => {
      it('delete payout by id', async () => {
        const id = '1';

        PayoutRepositoryMock.softDeleteById.mockResolvedValue(mockUpdateResult);
        await payoutService.deletePayoutById(id);
        expect(PayoutRepositoryMock.softDeleteById).toHaveBeenCalledWith(id);
      });
      it('should throw NotFoundException if payout id not found', async () => {
        const id = '1';
        const payoutId = 'mockPayoutId';
        PayoutRepositoryMock.getById.mockResolvedValue(null);
        PayoutRepositoryMock.softDeleteById.mockRejectedValue(new NotFoundException());

        await expect(payoutService.deletePayoutById(id)).rejects.toThrow(NotFoundException);
        expect(PayoutRepositoryMock.getById).toHaveBeenCalledWith(payoutId);
      });
    });

    describe('updatePayout', () => {
      it('should update a payout successfully', async () => {
        PayoutRepositoryMock.getById.mockResolvedValue(mockPayoutEntity);
        PayoutRepositoryMock.updatePayout.mockResolvedValue(createPayoutDto);

        const result = await payoutService.updatePayout(createPayoutDto);

        // Expectations
        expect(PayoutRepositoryMock.getById).toHaveBeenCalledWith(createPayoutDto.id);
        expect(PayoutRepositoryMock.updatePayout).toHaveBeenCalledWith(createPayoutDto);
        expect(result).toBeDefined();
        expect(result).toEqual(createPayoutDto);
      });
      it('should throw NotFoundException if payout does not exist', async () => {
        // Mock getById to resolve with null, indicating payout not found
        PayoutRepositoryMock.getById.mockResolvedValueOnce(null);

        // Call the method and expect it to throw NotFoundException
        await expect(payoutService.updatePayout(createPayoutDto)).rejects.toThrow(NotFoundException);
        expect(PayoutRepositoryMock.getById).toHaveBeenCalledWith(createPayoutDto.id);
      });
    });
    describe('updatePayoutSettlementTime', () => {
      it('should update payout settlement time for multiple payoutIds', async () => {
        const mockBody = {
          payoutIds: ['id1', 'id2', 'id3'],
        };

        PayoutRepositoryMock.updatePayoutSettlementTime.mockResolvedValue(mockBody);
        // Call the method
        const result = await payoutService.updatePayoutSettlementTime(mockBody);

        expect(PayoutRepositoryMock.updatePayoutSettlementTime).toHaveBeenCalledWith(mockBody.payoutIds);
        expect(result).toBeDefined();
      });

      it('should update payout settlement time for all payouts when no payoutIds provided', async () => {
        // Mock input data without payoutIds
        const mockBody = {};

        PayoutRepositoryMock.updatePayoutSettlementTime.mockResolvedValue(mockBody);

        // Call the method
        await payoutService.updatePayoutSettlementTime(mockBody);

        // Expect the updatePayoutSettlementTime method to be called without any arguments
        expect(PayoutRepositoryMock.updatePayoutSettlementTime).toHaveBeenCalledWith();
      });
    });

    describe('getPayoutsByTransactionIdAndBrandCode', () => {
      it('should retrieve payouts by transaction ID and brand code', async () => {
        // Arrange
        const vendorTransactionId = 'exampleTransactionId';
        const brandCode = 'exampleBrandCode';

        // Mock the getPayoutsByTransactionIdAndBrandCode method of the repository to return the expected payouts
        PayoutRepositoryMock.getPayoutsByTransactionIdAndBrandCode.mockResolvedValue(mockPayoutPageDto);

        // Act
        const result = await payoutService.getPayoutsByTransactionIdAndBrandCode(vendorTransactionId, brandCode);

        // Assert
        expect(result).toEqual(mockPayoutPageDto);
        expect(PayoutRepositoryMock.getPayoutsByTransactionIdAndBrandCode).toHaveBeenCalledWith(
          vendorTransactionId,
          brandCode,
        );
      });
    });

    describe('getPayoutsByTransferIdAndBrandCode', () => {
      it('should retrieve payouts by transfer ID and brand code', async () => {
        // Arrange
        const transferId = 'exampleTransferId';
        const brandCode = 'exampleBrandCode';

        PayoutRepositoryMock.getPayoutsByTransferIdAndBrandCode.mockResolvedValue(mockPayoutEntity);

        const result = await payoutService.getPayoutsByTransferIdAndBrandCode(transferId, brandCode);

        expect(result).toBeInstanceOf(SinglePayoutPageDto);
        expect(result).toBeDefined();
        expect(PayoutRepositoryMock.getPayoutsByTransferIdAndBrandCode).toHaveBeenCalledWith(transferId, brandCode);
      });
    });

    describe('updatePayoutByPayoutId', () => {
      it('should update payout by payoutId and trigger Kafka if status is PAID or SUCCESS', async () => {
        // trigger kafka is PRIVATE
        //payoutService.triggerPayoutKafka = jest.fn().mockImplementation(()=>[]);
        PayoutRepositoryMock.updatePayoutByPayoutId.mockResolvedValue(createPayoutDto);

        const result: UpdateResult = await payoutService.updatePayoutByPayoutId(createPayoutDto);

        expect(PayoutRepositoryMock.updatePayoutByPayoutId).toHaveBeenCalledWith(createPayoutDto);
        //if kafka
        // expect(PayoutRepositoryMock.findByPayoutId).toHaveBeenCalledWith(createPayoutDto.payoutId);
        expect(result).toEqual(createPayoutDto);
        expect(result).toBeDefined();
      });
    });

    //PRIVATE- doesnt add anything
    describe('triggerPayoutKafka', () => {
      it('updatePayoutByPayoutId triggers payout Kafka event when status is PAID or SUCCESS', async () => {
        PayoutRepositoryMock.updatePayoutByPayoutId.mockResolvedValue(createPayoutDto);

        // Call the method
        await payoutService.updatePayoutByPayoutId(createPayoutDto);
        expect(PayoutRepositoryMock.updatePayoutByPayoutId).toHaveBeenCalledWith(createPayoutDto);
      });
    });

    describe('fetchPayoutsBrandCodeStatusCondition', () => {
      it('should fetch payouts by brand code, status, start time, and end time', async () => {
        const mockBrandCode = 'ABC';
        const mockStatus = 'SUCCESS';
        const mockStartTime = new Date('2023-01-01');
        const mockEndTime = new Date('2023-01-31');

        // Mock the repository method to return the mock data
        PayoutRepositoryMock.fetchPayoutsBrandCodeStatusCondition.mockResolvedValueOnce(mockPayoutPageDto);

        // Call the method with the mock parameters
        const result = await payoutService.fetchPayoutsBrandCodeStatusCondition(
          mockBrandCode,
          mockStatus,
          mockStartTime,
          mockEndTime,
        );

        expect(PayoutRepositoryMock.fetchPayoutsBrandCodeStatusCondition).toHaveBeenCalledWith(
          mockBrandCode,
          mockStatus,
          mockStartTime,
          mockEndTime,
        );
        expect(result).toEqual(mockPayoutPageDto.data);
        expect(result).toBeDefined();
      });
    });
    describe('getPayoutsRevenueSourceByBrandCode', () => {
      it('should return revenue sources for a given brand code', async () => {
        const brandCode = 'exampleBrandCode';
        //Promise<any>
        const mockRevenueSources = ['Source1', 'Source2'];

        PayoutRepositoryMock.getPayoutsRevenueSourceByBrandCode.mockResolvedValue(mockRevenueSources);

        // Call the method
        const result = await payoutService.getPayoutsRevenueSourceByBrandCode(brandCode);

        // Assert
        expect(PayoutRepositoryMock.getPayoutsRevenueSourceByBrandCode).toHaveBeenCalledWith(brandCode);
        expect(result).toEqual(mockRevenueSources);
        expect(result).toBeDefined();
      });
    });

    describe('fetchPayoutsTotalAmount', () => {
      it('should return total amount for given parameters', async () => {
        // Mock data
        const params = {
          applicationCode: 'exampleApplicationCode',
          startTime: new Date('2024-01-01'),
          endTime: new Date('2024-01-31'),
          statuses: ['status1', 'status2'],
        };
        const mockTotalAmount = 5000;
        PayoutRepositoryMock.fetchPayoutsTotalAmount.mockResolvedValue(mockTotalAmount);

        // Call the method
        const result = await payoutService.fetchPayoutsTotalAmount(params);

        // Assert
        expect(PayoutRepositoryMock.fetchPayoutsTotalAmount).toHaveBeenCalledWith(params);
        expect(result).toEqual(mockTotalAmount);
        expect(result).toBeDefined();
      });
    });

    describe('updatePayoutStatusByPayoutIds', () => {
      it('should call updatePayoutStatusByPayoutIds method with correct parameters', async () => {
        //payload: UpdatePayoutStatus, currentUser: AuthUser
        const mockUpdatePayoutStatus = {
          payoutIds: ['id1', 'id2', 'id3'],
          status: 'paid',
          settlementTime: new Date('2024-03-05T12:00:00'),
        };
        // AuthUser
        const currentUser = {
          iss: 'mock_iss',
          sub: 'mock_sub',
          aud: ['mock_aud_1', 'mock_aud_2'],
          iat: 1614959886,
          exp: 1614963486,
          azp: 'mock_azp',
          scope: 'mock_scope',
          permissions: ['permission_1', 'permission_2'],
          clientName: 'mock_clientName',
          userId: 'mock_userId',
          customerId: 'mock_customerId',
        };
        PayoutRepositoryMock.updatePayoutStatusByPayoutIds.mockResolvedValue(mockUpdateResult);
        const result = await payoutService.updatePayoutStatusByPayoutIds(mockUpdatePayoutStatus, currentUser);

        expect(PayoutRepositoryMock.updatePayoutStatusByPayoutIds).toHaveBeenCalledWith(
          mockUpdatePayoutStatus,
          currentUser.userId,
        );
        expect(result).toBeDefined();
      });

      it('should throw BadRequestException if status and settlementTime are not provided', async () => {
        // Arrange

        const payload = {
          payoutIds: ['id1', 'id2', 'id3'],
        };
        //: AuthUser
        const currentUser = {
          iss: 'mock_iss',
          sub: 'mock_sub',
          aud: ['mock_aud_1', 'mock_aud_2'],
          iat: 1614959886,
          exp: 1614963486,
          azp: 'mock_azp',
          scope: 'mock_scope',
          permissions: ['permission_1', 'permission_2'],
          clientName: 'mock_clientName',
          userId: 'mock_userId',
          customerId: 'mock_customerId',
        };
        PayoutRepositoryMock.updatePayoutStatusByPayoutIds.mockResolvedValue(mockUpdateResult);
        // Act & Assert
        await expect(payoutService.updatePayoutStatusByPayoutIds(payload, currentUser)).rejects.toThrow(
          BadRequestException,
        );
      });
    });
    describe('getAllPayoutsByBrandCode', () => {
      it('should return all payouts by brandcode', async () => {
        // Arrange
        const brandCode = 'exampleBrandCode';
        //query(query: string, parameters?: any[]): Promise<any>;
        const query = {};
        PayoutRepositoryMock.getAllPayoutsByBrandCode.mockResolvedValue(query);

        //reconcile dtaa- any
        const result = await payoutService.getAllPayoutsByBrandCode(brandCode, '');

        // Assert
        expect(PayoutRepositoryMock.getAllPayoutsByBrandCode).toHaveBeenCalledWith(brandCode, '');
        expect(result).toEqual(query);
        expect(result).toBeDefined();
      });
    });
    describe('getAllPayoutsByApplicationCode', () => {
      it('should return all payouts by applicationcode', async () => {
        // Arrange
        const applicationCode = 'exampleAppCode';
        //query(query: string, parameters?: any[]): Promise<any>;
        const query = [
          {
            total_paid: 1000,
            last_payout_date: '2024-03-01',
            revenue_source: 'Source A',
            vendor: 'Vendor X',
          },
          {
            total_paid: 2000,
            last_payout_date: '2024-03-02',
            revenue_source: 'Source B',
            vendor: 'Vendor Y',
          },
        ];
        PayoutRepositoryMock.getAllPayoutsByApplicationCode.mockResolvedValue(query);

        // Act
        //reconcile dtaa- any
        const result = await payoutService.getAllPayoutsByApplicationCode(applicationCode, '');

        // Assert
        expect(PayoutRepositoryMock.getAllPayoutsByApplicationCode).toHaveBeenCalledWith(applicationCode, '');
        expect(result).toEqual(query);
        expect(result).toBeDefined();
      });
      it('should call the repository method without reconcile date when none is provided', async () => {
        // Arrange
        const applicationCode = 'your_application_code';

        // Act
        const query = [
          {
            total_paid: 1000,
            last_payout_date: '2024-03-01',
            revenue_source: 'Source A',
            vendor: 'Vendor X',
          },
          {
            total_paid: 2000,
            last_payout_date: '2024-03-02',
            revenue_source: 'Source B',
            vendor: 'Vendor Y',
          },
        ];
        PayoutRepositoryMock.getAllPayoutsByApplicationCode.mockResolvedValue(query);

        const result = await payoutService.getAllPayoutsByApplicationCode(applicationCode);

        // Assert
        expect(PayoutRepositoryMock.getAllPayoutsByApplicationCode).toHaveBeenCalledWith(applicationCode, undefined);
        expect(result).toBeDefined();
      });
      it('should throw an error when no payouts are found', async () => {
        // Arrange
        const applicationCode = 'application_code';
        const reconcileDate = 'reconcile_date';

        PayoutRepositoryMock.getAllPayoutsByApplicationCode.mockRejectedValue(new NotFoundException());
        await expect(payoutService.getAllPayoutsByApplicationCode(applicationCode, reconcileDate)).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('getAllPayoutsByApplicationCodeGroupByResourceAndVendor', () => {
      it('should return all payouts by ApplicationCodeGroupByResourceAndVendor', async () => {
        // Arrange
        const applicationCode = 'exampleAppCode';
        const reconcile = 'reconcile_data';
        const query = [
          {
            total_paid: 1000,
            last_payout_date: '2024-03-01',
            revenue_source: 'Source A',
            vendor: 'Vendor X',
          },
          {
            total_paid: 2000,
            last_payout_date: '2024-03-02',
            revenue_source: 'Source B',
            vendor: 'Vendor Y',
          },
        ];

        PayoutRepositoryMock.getAllPayoutsByApplicationCodeGroupByRevenueSourceAndVendor.mockResolvedValue(query);

        // Act
        //reconcile dtaa- any
        const result = await payoutService.getAllPayoutsByApplicationCodeGroupByResourceAndVendor(
          applicationCode,
          reconcile,
        );

        // Assert
        expect(PayoutRepositoryMock.getAllPayoutsByApplicationCodeGroupByRevenueSourceAndVendor).toHaveBeenCalledWith(
          applicationCode,
          reconcile,
        );
        expect(result).toEqual(query);
        expect(result).toBeDefined();

        //differnet names for Mainfunction & CallFunction
        //getAllPayoutsByApplicationCodeGroupByResourceAndVendor
        //getAllPayoutsByApplicationCodeGroupByRevenueSourceAndVendor
      });
      it('should call the repository method without reconcile date when none is provided', async () => {
        // Arrange
        const applicationCode = 'your_application_code';

        // Act
        const query = [
          {
            total_paid: 1000,
            last_payout_date: '2024-03-01',
            revenue_source: 'Source A',
            vendor: 'Vendor X',
          },
          {
            total_paid: 2000,
            last_payout_date: '2024-03-02',
            revenue_source: 'Source B',
            vendor: 'Vendor Y',
          },
        ];
        PayoutRepositoryMock.getAllPayoutsByApplicationCodeGroupByRevenueSourceAndVendor.mockResolvedValue(query);

        const result = await payoutService.getAllPayoutsByApplicationCodeGroupByResourceAndVendor(applicationCode);

        // Assert
        expect(PayoutRepositoryMock.getAllPayoutsByApplicationCodeGroupByRevenueSourceAndVendor).toHaveBeenCalledWith(
          applicationCode,
          undefined,
        );
        expect(result).toBeDefined();
      });
      it('should throw an error when no payouts are found', async () => {
        // Arrange
        const applicationCode = 'application_code';
        const reconcileDate = 'reconcile_date';

        PayoutRepositoryMock.getAllPayoutsByApplicationCodeGroupByRevenueSourceAndVendor.mockRejectedValue(
          new NotFoundException(),
        );

        await expect(
          payoutService.getAllPayoutsByApplicationCodeGroupByResourceAndVendor(applicationCode, reconcileDate),
        ).rejects.toThrow(NotFoundException);
      });
    });

    describe('calculatePayoutsPg', () => {
      const mockBrandTransaction: IBrandTransactionObj = {
        id: '1',
        vendor: 'Vendor X',
        transactionId: '1234567890',
        amount: 1000,
        brandCode: 'BRAND123',
        addedOn: '2024-03-05T12:00:00Z',
        vendorTransactionId: 'VENDOR123',
        balance: 500,
        body: {},
        transferType: 'CREDIT',
        requestId: 'REQUEST123',
        transactionDate: '2024-03-05T12:00:00Z',
        revenueSource: 'REVENUE_SOURCE',
        revenueSourceEntity: 'ENTITY_X',
        retryCount: 0,
        retryFlag: false,
        isArchived: false,
        config: { key: 'value' },
      };
      const vendorId = 'VENDOR_ID';

      it('should handle error', async () => {
        const mockExecuteQuery = jest.fn();
        mockExecuteQuery.mockRejectedValueOnce(new Error('Error message'));
        graphqlService.executeQuery = mockExecuteQuery;
        const result = await payoutService.calculatePayoutsPg(mockBrandTransaction, vendorId);
        expect(result).toEqual(undefined);
      });
    });

    describe('getSettlementAccountDetailsGql', () => {
      it('should return settlement account details for a given settlementId', async () => {
        // Arrange
        const settlementId = 'YOUR_SETTLEMENT_ID';
        const expectedSettlementAccountDetails = {
          accountNumber: '1234567890',
          accountHolderName: 'John Doe',
          ifsc: 'ABCD123456',
          settlementAccountConfigData: 'Some config data',
        };

        const mockExecuteQuery = jest.fn();
        mockExecuteQuery.mockResolvedValue({
          klub_loan_mgmt_settlement_account_config: [expectedSettlementAccountDetails],
        });

        graphqlService.executeQuery = mockExecuteQuery;
        const result = await payoutService.getSettlementAccountDetailsGql(settlementId);

        // Assert
        expect(graphqlService.executeQuery).toHaveBeenCalledWith(expect.any(String), { settlementId });
        expect(result).toEqual(expectedSettlementAccountDetails);
      });

      it('should return undefined if no settlement account details found', async () => {
        // Arrange
        const settlementId = 'NON_EXISTENT_SETTLEMENT_ID';
        const mockExecuteQuery = jest.fn();
        mockExecuteQuery.mockResolvedValue({
          klub_loan_mgmt_settlement_account_config: [],
        });

        graphqlService.executeQuery = mockExecuteQuery;

        // Act
        const result = await payoutService.getSettlementAccountDetailsGql(settlementId);

        // Assert
        expect(graphqlService.executeQuery).toHaveBeenCalledWith(expect.any(String), { settlementId });
        expect(result).toBeUndefined();
      });
    });

    describe('updateReferenceNumber', () => {
      it('should trigger AWS Lambda with correct payload', async () => {
        // Arrange
        const event = {};
        const lambdaFunctionName = 'LAMBDA_FUNCTION';
        ConfigServiceMock.get.mockReturnValue(lambdaFunctionName);
        //AwsClientServiceMock.trigger.mockResolvedValue();

        // Act
        await payoutService.updateReferenceNumber(event);

        // Assert
        expect(ConfigServiceMock.get).toHaveBeenCalledWith('UPDATE_REFERENCE_NUMBER_ARN');
        expect(AwsClientServiceMock.trigger).toHaveBeenCalledWith({
          functionName: lambdaFunctionName,
          payload: event,
        });
      });

      it('should throw BadRequestException if error occurs', async () => {
        // Arrange
        const error = new Error('Test error message');
        ConfigServiceMock.get.mockReturnValue('LAMBDA_FUNCTION');
        AwsClientServiceMock.trigger.mockRejectedValue(error);

        // Act & Assert
        await expect(payoutService.updateReferenceNumber()).rejects.toThrow(BadRequestException);
        expect(ConfigServiceMock.get).toHaveBeenCalledWith('UPDATE_REFERENCE_NUMBER_ARN');
        expect(AwsClientServiceMock.trigger).toHaveBeenCalled();
      });
    });
  });
});
