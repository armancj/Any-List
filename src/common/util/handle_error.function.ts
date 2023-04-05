import { Postgres_error_code } from '../enums/postgres_error_code.enum';
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';

export function handleDBExceptions(error: any, message?: string): never {
  const logger = new Logger(handleDBExceptions.name);
  if (error?.code === Postgres_error_code.UniqueViolation)
    throw new ConflictException(detailsWords(error.detail));

  if (error?.code === Postgres_error_code.ForeignKeyViolation)
    throw new NotFoundException(detailsWords(error.detail));

  if (error instanceof EntityNotFoundError)
    throw new NotFoundException(replaceEntityNotFoundError(error.message));

  logger.error(`${error}, code: ${error?.code}, detail: ${error?.detail} `);
  throw new InternalServerErrorException('Unexpected error check server logs');
}

function detailsWords(str) {
  return capitalizeFirstLetter(
    (str + '')
      .replace('Key ', '')
      .replace(/[()"]+/g, '')
      .replace('=', ': '),
  );
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function replaceEntityNotFoundError(str) {
  return str
    .replace('EntityNotFoundError: ', '')
    .replace(/[{}"]+/g, '')
    .replace(/\n/g, '')
    .replace(':     ', ' ');
}
