// Simple test script for the forex model
import { runModelTests } from './lib/modelCalculations.js';

console.log('=== V07 MODEL VALIDATION ===\n');

try {
  const result = runModelTests();
  console.log('✅ All tests completed successfully!');
  console.log('Results:', JSON.stringify(result, null, 2));
} catch (error) {
  console.error('❌ Error running tests:', error.message);
  console.error(error);
}