/**
 * Database table name validation utilities
 * Ensures consistent use of "users" table name and prevents PostgreSQL reserved keyword issues
 */

/**
 * Validates that we're using the correct "users" table name
 * PostgreSQL reserves "user" as a keyword, so we must use "users"
 */
export function validateTableName(tableName: string): string {
  if (tableName === 'user') {
    throw new Error(
      'Table name "user" is a PostgreSQL reserved keyword. Use "users" instead. ' +
      'This prevents the error: relation \'user\' does not exist'
    );
  }
  
  if (tableName === 'users') {
    return tableName;
  }
  
  // For other tables, return as-is but warn about potential reserved keywords
  const reservedKeywords = [
    'user', 'order', 'group', 'table', 'index', 'view', 'trigger', 
    'function', 'procedure', 'schema', 'database', 'column'
  ];
  
  if (reservedKeywords.includes(tableName.toLowerCase())) {
    console.warn(`Warning: "${tableName}" may be a PostgreSQL reserved keyword. Consider using quotes or a different name.`);
  }
  
  return tableName;
}

/**
 * Ensures proper quoting for table names in raw SQL
 */
export function quoteTableName(tableName: string): string {
  const validatedName = validateTableName(tableName);
  return `"${validatedName}"`;
}

/**
 * Migration helper to safely rename 'user' table to 'users'
 */
export const RENAME_USER_TABLE_SQL = `
-- Safe migration to rename 'user' table to 'users' if needed
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'user' 
        AND table_schema = 'public'
    ) AND NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE "user" RENAME TO "users";
        RAISE NOTICE 'Successfully renamed table "user" to "users"';
    END IF;
END $$;
`;