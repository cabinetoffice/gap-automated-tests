// @ts-ignore
import * as contentful from "contentful-management";
import "dotenv/config";

export const publishGrantAdverts = () => {
  console.log("publishing");
  const client = contentful.createClient({
    // This is the access token for this space. Normally you get the token in the Contentful web app
    accessToken: process.env["contentful.accessToken"],
  });
  // This API call will request a space with the specified ID
  client.getSpace(process.env["contentful.spaceId"]).then((space) => {
    // This API call will request an environment with the specified ID
    space
      .getEnvironment(process.env["contentful.environmentId"])
      .then((environment) => {
        // Now that we have an environment, we can get entries from that space
        environment.getEntries().then((entries) => {
          //console.log(entries.items);
        });

        // // let's get a content type
        // environment.getContentType('product').then((contentType) => {
        //   // and now let's update its name
        //   contentType.name = 'New Product'
        //   contentType.update().then((updatedContentType) => {
        //     console.log('Update was successful')
        //   })
        // })
      });
  });
};

export const deleteGrantAdverts = () => {};

publishGrantAdverts();
