import { Repository } from 'typeorm';
import { TransactionRepository } from '../transaction.repository';
import { CreateTransactionDto } from '../dto/CreateTransactionDto';
import { TransactionEntity } from '../transaction.entity';
import { TransactionDto } from '../dto/TransactionDto';
import { NotFoundException } from '@nestjs/common';
import { PageMetaDto } from '../../../common/dto/PageMetaDto';
import { TransactionPageDto } from '../dto/TransactionPageDto';
import { UpdateResult, In } from 'typeorm';
import { UpdateRetryFlagDto } from '../dto/UpdateRetryFlagDto';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionService } from '../transaction.service';

// // Mock data for CreateTransactionDto
const createTransactionDto = {
  id: '1',
  createdAt: '2024-02-26T12:00:00Z',
  updatedAt: '2024-02-26T12:00:00Z',
  transactionId: '123',
  brandCode: 'ABC',
  vendor: 'VendorName',
  amount: 100.5,
  body: { key: 'value' },
  requestId: 'REQ123',
  retryCount: 3,
  retryFlag: false,
  revenueSource: 'Source1',
  revenueSourceEntity: 'Entity1',
  vendorTransactionId: 'VENDOR123',
  createdBy: 'user1',
  updatedBy: 'user2',
  isArchived: false,
  transactionDate: new Date('2024-02-26T12:00:00Z'),
  transferType: 'Type1',
  balance: 500.75,
  tenantCode: 'TENANT001',
};

//const mockTransactionEntity: TransactionEntity = {
const mockTransactionEntity = {
  id: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
  transactionId: '123',
  brandCode: 'ABC',
  vendor: 'VendorName',
  amount: 100.5,
  body: { key: 'value' },
  requestId: 'REQ123',
  retryCount: 3,
  retryFlag: false,
  revenueSource: 'Source1',
  revenueSourceEntity: 'Entity1',
  vendorTransactionId: 'VENDOR123',
  createdBy: 'user1',
  updatedBy: 'user2',
  isArchived: false,
  transactionDate: new Date('2024-02-26T12:00:00Z'),
  transferType: 'Type1',
  balance: 500.75,
  tenantCode: 'TENANT001',
  isMigrated: false,
  dtoClass: TransactionDto,
  toDto: () => new TransactionDto(mockTransactionEntity),
};
const mockRecords = [
  {
    id: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
    transactionId: 'transactionId1',
    brandCode: 'brandCode1',
    vendor: 'vendor1',
    amount: 100.5,
    body: {},
    requestId: 'requestId1',
    retryCount: 0,
    retryFlag: false,
    revenueSource: 'revenueSource1',
    revenueSourceEntity: 'revenueSourceEntity1',
    vendorTransactionId: 'vendorTransactionId1',
    createdBy: 'createdBy1',
    updatedBy: 'updatedBy1',
    isArchived: false,
    transactionDate: new Date(),
    transferType: 'transferType1',
    balance: 0,
    tenantCode: 'tenantCode1',
    isMigrated: false,
    dtoClass: TransactionDto,
    toDto: () => new TransactionDto(mockTransactionEntity),
  },
  {
    id: '2',
    createdAt: new Date(),
    updatedAt: new Date(),
    transactionId: 'transactionId2',
    brandCode: 'brandCode2',
    vendor: 'vendor2',
    amount: 200.75,
    body: {},
    requestId: 'requestId2',
    retryCount: 0,
    retryFlag: false,
    revenueSource: 'revenueSource2',
    revenueSourceEntity: 'revenueSourceEntity2',
    vendorTransactionId: 'vendorTransactionId2',
    createdBy: 'createdBy2',
    updatedBy: 'updatedBy2',
    isArchived: false,
    transactionDate: new Date(),
    transferType: 'transferType2',
    balance: 0,
    tenantCode: 'tenantCode2',
    isMigrated: false,
    dtoClass: TransactionDto,
    toDto: () => new TransactionDto(mockTransactionEntity),
  },
];

//Create mock Repository
const mockTransactionEntityRepository = {
  save: jest.fn(),
  findOne: jest.fn(),
  findAndCount: jest.fn(),
  //getById: jest.fn(), - getById is a function using findOne
  update: jest.fn(),
} as any;

let transactionRepository: TransactionRepository;
transactionRepository = new TransactionRepository(mockTransactionEntityRepository);

describe('TransactionRepository', () => {
  beforeEach(async () => {
    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      distinctOn: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    };

    const mockRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder), // Mock createQueryBuilder to return mockQueryBuilder
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionRepository,
        {
          provide: getRepositoryToken(TransactionEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();
    jest.clearAllMocks();
  });

  describe('createTransaction', () => {
    it('should create a transaction', async () => {
      // Mock the save method of mock Repository to return the mockTransactionEntity
      mockTransactionEntityRepository.save.mockResolvedValueOnce(mockTransactionEntity);

      // Call the createTransaction method
      const result = await transactionRepository.createTransaction(createTransactionDto);

      // Assertions
      expect(mockTransactionEntityRepository.save).toHaveBeenCalledWith(createTransactionDto);
      expect(result).toEqual(mockTransactionEntity);
    });
  });

  describe('getTransactionByBrandCodeAndTransactionId', () => {
    it('should return a transaction', async () => {
      // Mock data for the parameters
      const transactionId = '123';
      const brandCode = 'ABC';
      const vendor = 'VendorName';
      const select: Array<keyof TransactionEntity> = ['transactionId', 'brandCode', 'amount']; // Mocking the select parameter

      // Mock the findOne method of mock Repository to return the mockTransactionEntity
      mockTransactionEntityRepository.findOne.mockResolvedValueOnce(mockTransactionEntity);

      // Call the getTransactionByBrandCodeAndTransactionId method
      const result = await transactionRepository.getTransactionByBrandCodeAndTransactionId(
        transactionId,
        brandCode,
        vendor,
        select,
      );

      // Assertions
      expect(mockTransactionEntityRepository.findOne).toHaveBeenCalledWith({
        where: { transactionId, brandCode, vendor },
        select,
      });
      expect(result).toEqual(mockTransactionEntity);
    });
  });

  describe('getById', () => {
    it('should return a transaction by ID', async () => {
      // expect(mockTransactionEntityRepository.findOne).toHaveBeenCalledWith('1', undefined);
      //mockTransactionEntityRepository.findOne = jest.fn().mockImplementationOnce(()=>mockTransactionEntity);
      mockTransactionEntityRepository.findOne.mockResolvedValue(mockTransactionEntity);
      const result = await transactionRepository.getById('1');

      expect(mockTransactionEntityRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockTransactionEntityRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        select: undefined,
      });
      expect(result).toEqual(mockTransactionEntity);
    });

    it('should return a transaction by ID with selected fields', async () => {
      // Call the getById method
      //mockTransactionEntityRepository.findOne = jest.fn().mockImplementationOnce(()=>mockTransactionEntity);
      mockTransactionEntityRepository.findOne.mockResolvedValue(mockTransactionEntity);
      const result = await transactionRepository.getById('1', ['id', 'brandCode']);
      // Expectations
      expect(mockTransactionEntityRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockTransactionEntityRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        select: ['id', 'brandCode'],
      });

      expect(result).toEqual(mockTransactionEntity);
    });
  });

  describe('getByTransactionId', () => {
    it('should return a transaction by transactionId', async () => {
      // Mocking the findOne method of the repository to return the mock transaction
      mockTransactionEntityRepository.findOne.mockResolvedValueOnce(mockTransactionEntity);

      // Calling the getByTransactionId method with a transactionId
      const result = await transactionRepository.getByTransactionId('123');

      // Expectations
      expect(mockTransactionEntityRepository.findOne).toHaveBeenCalledWith({
        where: { transactionId: '123' },
        select: undefined,
      });
      expect(result).toEqual(mockTransactionEntity);
    });

    it('should return a transaction by transactionId with selected fields', async () => {
      // Mocking the findOne method of the repository to return the mock transaction
      mockTransactionEntityRepository.findOne.mockResolvedValueOnce(mockTransactionEntity);

      // Calling the getByTransactionId method with a transactionId and selected fields
      const result = await transactionRepository.getByTransactionId('123', ['id', 'brandCode']);

      expect(mockTransactionEntityRepository.findOne).toHaveBeenCalledWith({
        where: { transactionId: '123' },
        select: ['id', 'brandCode'],
      });
      expect(result).toEqual(mockTransactionEntity);
    });
  });

  describe('softDeleteById', () => {
    it('should soft delete a transaction by ID', async () => {
      mockTransactionEntityRepository.findOne = jest.fn().mockImplementationOnce(() => mockTransactionEntity);

      // Calling the softDeleteById method with a transaction ID and current user
      const currentUser = 'user1';
      await transactionRepository.softDeleteById('1', currentUser);

      // Expectations

      expect(mockTransactionEntityRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        select: undefined,
      });
      expect(mockTransactionEntityRepository.update).toHaveBeenCalledWith(
        { id: '1' },
        { isArchived: true, updatedBy: currentUser },
      );
    });

    it('should throw NotFoundException if transaction with given ID does not exist', async () => {
      // Mocking the getById method of the repository to return null (transaction not found)
      mockTransactionEntityRepository.findOne.mockResolvedValueOnce(null);

      // Expecting the softDeleteById method to throw a NotFoundException
      await expect(transactionRepository.softDeleteById('1', 'user1')).rejects.toThrow(NotFoundException);

      // Expectations
      expect(mockTransactionEntityRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        select: undefined,
      });
      expect(mockTransactionEntityRepository.update).not.toHaveBeenCalled();
    });

    it('should soft delete a transaction without updating updatedBy if currentUser is not provided', async () => {
      // Mocking the getById method of the repository to return the mock transaction
      mockTransactionEntityRepository.findOne.mockResolvedValueOnce(mockTransactionEntity);

      // Calling the softDeleteById method with a transaction ID and without providing a current user
      await transactionRepository.softDeleteById('1', '');

      // Expectations
      expect(mockTransactionEntityRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockTransactionEntityRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        select: undefined,
      });
      expect(mockTransactionEntityRepository.update).toHaveBeenCalledWith({ id: '1' }, { isArchived: true });
    });
  });

  describe('updateTransactionRevenueSource', () => {
    it('should update transaction revenue source with currentUser', async () => {
      // Mock currentUser
      const currentUser = 'user123';

      // Mock the expected queryOptions
      const expectedQueryOptions = {
        revenueSource: createTransactionDto.revenueSource,
        revenueSourceEntity: createTransactionDto.revenueSourceEntity,
        updatedBy: currentUser,
      };

      // Mock the update method of mock Repository to return a successful UpdateResult
      const mockUpdateResult: UpdateResult = {
        raw: '',
        affected: 1,
        generatedMaps: [],
      };
      mockTransactionEntityRepository.update.mockResolvedValueOnce(mockUpdateResult);

      // Call the updateTransactionRevenueSource method
      const result = await transactionRepository.updateTransactionRevenueSource(createTransactionDto, currentUser);

      // Assertions
      expect(mockTransactionEntityRepository.update).toHaveBeenCalledWith(
        { id: createTransactionDto.id },
        expectedQueryOptions,
      );
      expect(result).toEqual(mockUpdateResult);
    });
  });

  describe('updateRetryFlagMetric', () => {
    it('should update retry flag metric with currentUser', async () => {
      // Mock data
      const retryCount = 2;
      const retryFlag = true;
      const id = '123456';
      const brandCode = 'ABC';
      const currentUser = 'user123';

      // Mock the expected queryOptions
      const expectedQueryOptions = {
        retryCount,
        retryFlag,
        updatedBy: currentUser,
      };

      // Mock the update method of mock Repository to return a successful UpdateResult
      const mockUpdateResult: UpdateResult = {
        raw: '',
        affected: 1,
        generatedMaps: [],
      };
      mockTransactionEntityRepository.update.mockResolvedValueOnce(mockUpdateResult);

      // Call the updateRetryFlagMetric method
      const result = await transactionRepository.updateRetryFlagMetric(
        retryCount,
        retryFlag,
        id,
        brandCode,
        currentUser,
      );

      // Assertions
      expect(mockTransactionEntityRepository.update).toHaveBeenCalledWith({ id, brandCode }, expectedQueryOptions);
      expect(result).toEqual(mockUpdateResult);
    });
  });

  describe('updateRetryFlagByTransactionIds', () => {
    it('should update retry flag by transaction IDs', async () => {
      // Mock data for UpdateRetryFlagDto
      const updateRetryFlagDto: UpdateRetryFlagDto = {
        transactionIds: ['123456', '789012'],
        retryFlag: true,
      };

      // Mock userId
      const userId = 'user123';

      // Mock the expected queryOptions
      const expectedQueryOptions = {
        retryFlag: updateRetryFlagDto.retryFlag,
        updatedBy: userId,
      };

      // Mock the update method of mock Repository to return a successful UpdateResult
      const mockUpdateResult: UpdateResult = {
        raw: '',
        affected: 2,
        generatedMaps: [],
      };
      mockTransactionEntityRepository.update.mockResolvedValueOnce(mockUpdateResult);

      // Call the updateRetryFlagByTransactionIds method
      const result = await transactionRepository.updateRetryFlagByTransactionIds(updateRetryFlagDto, userId);

      // Assertions
      expect(mockTransactionEntityRepository.update).toHaveBeenCalledWith(
        { transactionId: In(updateRetryFlagDto.transactionIds) },
        expectedQueryOptions,
      );
      expect(result).toEqual(mockUpdateResult);
    });
  });

  describe('getTransactionsRevenueSourceByBrandCode', () => {
    it('should return revenue sources by brandCode', async () => {
      // Provide valid brandCode
      const brandCode = 'ABC';

      // Mock the behavior of _transactionEntityRepository.createQueryBuilder, select, where, distinctOn, and getMany
      const mockRecords = [{ revenueSource: 'Source1' }, { revenueSource: 'Source2' }];
      transactionRepository._transactionEntityRepository.createQueryBuilder = jest.fn().mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        distinctOn: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce(mockRecords),
        andWhere: jest.fn().mockReturnThis(),
      });

      // Call the getTransactionsRevenueSourceByBrandCode method
      const result = await transactionRepository.getTransactionsRevenueSourceByBrandCode(brandCode);

      // Assertions
      expect(result).toEqual({ revenueSource: ['Source1', 'Source2'] });
    });
  });
});

//Ignored remaining functions test cases due to toDtos & records.length==0 ERROR
