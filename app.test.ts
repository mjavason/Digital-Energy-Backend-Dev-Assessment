import axios from 'axios';

describe('External API - Site Live Test', () => {
  it('should confirm the site is live and returns a successful response', async () => {
    const url = `https://api.restful-api.dev`;

    const response = await axios.get(url);

    // Ensure the response status is 200 (OK)
    expect(response.status).toBe(200);

    // Optionally, check if the data exists in the response
    expect(response.data).toBeDefined();
  });
});
