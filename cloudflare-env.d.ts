declare namespace Cloudflare {
  interface Env {
    CATALOG_ADMIN_EMAIL?: string;
    DB?: D1Database;
    BUCKET?: R2Bucket;
  }
}
