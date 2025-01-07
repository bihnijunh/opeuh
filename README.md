

## SMS-Activate API Integration

This section provides code examples for integrating various SMS-Activate API functions into a Next.js application. These examples are meant to be used as a reference and should be adapted to your specific project structure and needs.

### API Helper Function

First, let's create a helper function to make API calls:

```typescript
const API_KEY = process.env.SMS_ACTIVATE_API_KEY;
const BASE_URL = 'https://api.sms-activate.org/stubs/handler_api.php';

async function fetchSMSActivateAPI(action: string, params: Record<string, string> = {}) {
  const url = new URL(BASE_URL);
  url.searchParams.append('api_key', API_KEY!);
  url.searchParams.append('action', action);
  
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value);
  }

  const response = await fetch(url.toString());
  const data = await response.json();
  return data;
}
```

### API Function Examples

Here are examples of how to implement various SMS-Activate API functions:

#### Request available quantity of virtual numbers

```typescript
async function getAvailableNumbers(country: string = '0') {
  return await fetchSMSActivateAPI('getNumbersStatus', { country });
}
```

#### Request top countries by service

```typescript
async function getTopCountriesByService(service: string) {
  return await fetchSMSActivateAPI('getTopCountriesByService', { service });
}
```

#### Balance inquiry

```typescript
async function getBalance() {
  return await fetchSMSActivateAPI('getBalance');
}
```

#### Request available operators

```typescript
async function getAvailableOperators(country: string = '0') {
  return await fetchSMSActivateAPI('getOperators', { country });
}
```

#### Request active activations

```typescript
async function getActiveActivations() {
  return await fetchSMSActivateAPI('getActiveActivations');
}
```

#### Request a number

```typescript
async function getNumber(service: string, country: string = '0') {
  return await fetchSMSActivateAPI('getNumber', { service, country });
}
```

#### Number Request Version 2

```typescript
async function getNumberV2(service: string, country: string = '0') {
  return await fetchSMSActivateAPI('getNumberV2', { service, country });
}
```

#### Order virtual number for multiple services

```typescript
async function getMultiServiceNumber(services: string[], country: string = '0') {
  return await fetchSMSActivateAPI('getMultiServiceNumber', { multiService: services.join(','), country });
}
```

#### Change activation status

```typescript
async function setStatus(id: string, status: string) {
  return await fetchSMSActivateAPI('setStatus', { id, status });
}
```

#### Get activation status

```typescript
async function getStatus(id: string) {
  return await fetchSMSActivateAPI('getStatus', { id });
}
```

#### Get activation history

```typescript
async function getActivationHistory(start: string, end: string) {
  return await fetchSMSActivateAPI('getHistory', { start, end });
}
```

#### Get TOP 10 countries by service

```typescript
async function getTopCountriesByService(service: string) {
  return await fetchSMSActivateAPI('getListOfTopCountriesByService', { service });
}
```

#### Get status of incoming call

```typescript
async function getIncomingCallStatus(id: string) {
  return await fetchSMSActivateAPI('getIncomingCallStatus', { activationId: id });
}
```

#### Get current prices by country

```typescript
async function getPricesByCountry(country: string) {
  return await fetchSMSActivateAPI('getPrices', { country });
}
```

#### Get up-to-date prices for verification services

```typescript
async function getPricesForVerification(service: string) {
  return await fetchSMSActivateAPI('getPricesVerification', { service });
}
```

#### Get list of all countries

```typescript
async function getAllCountries() {
  return await fetchSMSActivateAPI('getCountries');
}
```

#### Get list of all services

```typescript
async function getAllServices() {
  return await fetchSMSActivateAPI('getServicesList');
}
```

#### Additional service for redirected numbers

```typescript
async function getAdditionalService(service: string, id: string) {
  return await fetchSMSActivateAPI('getAdditionalService', { service, id });
}
```

#### Additional activation

```typescript
async function getExtraActivation(id: string) {
  return await fetchSMSActivateAPI('getExtraActivation', { activationId: id });
}
```

#### Get current price for service

```typescript
async function getCurrentPrice(service: string, country: string = '0') {
  return await fetchSMSActivateAPI('getPrices', { service, country });
}
```

#### Call service

```typescript
async function createCallTask(id: string, phone: string) {
  return await fetchSMSActivateAPI('createTaskForCall', { activationId: id, phone });
}
```

#### Check outgoing call status

```typescript
async function getOutgoingCallStatus(date: string) {
  return await fetchSMSActivateAPI('getOutgoingCalls', { date });
}
```

#### Rent API

```typescript
async function getRentNumber(service: string, country: string = '0', time: string = '4') {
  return await fetchSMSActivateAPI('getRentNumber', { service, country, rent_time: time });
}
```

### Usage

To use these functions in your Next.js application, you'll need to create an API route to handle the requests securely, keeping your API key on the server side. Then, you can call these functions from your server-side code or create client-side functions that interact with your custom API route.

Remember to set your SMS_ACTIVATE_API_KEY in your environment variables.
