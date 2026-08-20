import { SetMetadata } from '@nestjs/common';
export const IS_PUBLIC_KEY = 'isPublic';
/**
 * Custom decorator to mark a route as public
 * @returns
 */
export const SkipAuth = () => SetMetadata(IS_PUBLIC_KEY, true);
