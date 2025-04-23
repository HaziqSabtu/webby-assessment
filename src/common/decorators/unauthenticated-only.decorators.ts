import { SetMetadata } from '@nestjs/common';

export const IS_UNAUTH_ONLY_KEY = 'isUnauthOnly';
export const UnauthenticatedOnly = () => SetMetadata(IS_UNAUTH_ONLY_KEY, true);
