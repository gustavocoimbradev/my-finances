import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "src/app/api", 
    definition: {
      openapi: "3.1.0",
      info: {
        title: "My Finances API",
        version: "1.0",
      },
      // components: {
      //   securitySchemes: {
      //     ApiKeyAuth: {
      //       type: "apiKey",
      //       in: "query",
      //       name: "token",
      //     },
      //   },
      // },
      // security: [
      //   {
      //     ApiKeyAuth: [],
      //   },
      // ],
    },
  });
  return spec;
};