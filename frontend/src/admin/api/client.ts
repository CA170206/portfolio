/**
 * Admin API Client
 *
 * Re-exports the shared API client and URL normalization utilities from frontend/src/api/apiClient.
 * Preserves backwards compatibility for all admin modules importing from this location.
 */

export * from '../../api/apiClient';
export { default } from '../../api/apiClient';
