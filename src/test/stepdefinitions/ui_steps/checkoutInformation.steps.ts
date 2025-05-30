import { When } from '@cucumber/cucumber';
import { CustomWorld } from '@support/CustomWorld';
import { faker } from '@faker-js/faker';

When('the user fills the personal information form with valid details', async function (this: CustomWorld) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const postalCode = faker.location.zipCode();

  this.userInfo = { firstName, lastName, postalCode };

  await this.checkoutInformationPage.fillPersonalInformationForm(firstName, lastName, postalCode);
});
