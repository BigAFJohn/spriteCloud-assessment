import { When } from '@cucumber/cucumber';
import { CustomWorld } from '@support/CustomWorld';

When('the user click on finish button', async function (this: CustomWorld) {
  await this.checkoutConfirmationPage.clickFinishButton();
});
