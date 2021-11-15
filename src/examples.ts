import { JsonSchema, VC } from "./types";
import { baseVcJsonSchema } from "./helpers";

export const EXAMPLE_SCHEMAS: { [key: string]: JsonSchema } = {
  DiplomaCredential: {
    $schema: "http://json-schema.org/draft-07/schema#",
    $id: "https://beta.api.schemas.serto.id/v1/public/diploma-credential/json-schema.json",
    $comment:
      '{"term": "DiplomaCredential", "@id": "https://beta.api.schemas.serto.id/v1/public/diploma-credential/ld-context.json#"}',
    $metadata: {
      uris: {
        jsonLdContext: "https://beta.api.schemas.serto.id/v1/public/diploma-credential/ld-context.json",
        jsonSchema: "https://beta.api.schemas.serto.id/v1/public/diploma-credential/json-schema.json",
      },
      version: "1.0",
      slug: "diploma-credential",
      icon: "🎓",
      discoverable: true,
    },
    title: "Diploma Credential",
    description: "Credential attesting an alumni's degree from a university.",

    ...baseVcJsonSchema,

    properties: {
      ...baseVcJsonSchema.properties,
      credentialSubject: {
        $comment: '{"term": "credentialSubject", "@id": "https://www.w3.org/2018/credentials#credentialSubject"}',
        type: "object",
        required: ["id", "universityName", "degreeName"],
        properties: {
          id: {
            $comment: '{"term": "id", "@id": "@id"}',
            title: "Alumni ID",
            type: "string",
            format: "uri",
          },
          universityId: {
            $comment: '{"term": "universityId", "@id": "@id"}',
            title: "University ID",
            description: "",
            type: "string",
            format: "uri",
          },
          universityName: {
            $comment: '{"term": "universityName", "@id": "https://schema.org/Text"}',
            title: "University Name",
            description: "",
            type: "string",
          },
          degreeName: {
            $comment: '{"term": "degreeName", "@id": "https://schema.org/Text"}',
            title: "Degree Name",
            description: 'E.g. "Bachelor of Arts in Astrophysics"',
            type: "string",
          },
          graduationDate: {
            $comment: '{"term": "graduationDate", "@id": "https://schema.org/Date"}',
            title: "Graduation Date",
            description: "",
            type: "string",
            format: "date",
          },
        },
      },
    },
  },
  ContentPublishCredential: {
    $schema: "http://json-schema.org/draft-07/schema#",
    $id: "https://example.com/schemas/content-publish-credential/ld-context.json",
    $comment:
      '{"term": "ContentPublishCredential", "@id": "https://example.com/schemas/content-publish-credential/ld-context.json#"}',
    $metadata: {
      uris: {
        jsonLdContext: "https://example.com/schemas/content-publish-credential/ld-context.json",
        jsonSchema: "https://example.com/schemas/content-publish-credential/json-schema.json",
      },
      version: "1.0",
      slug: "content-publish-credential",
      icon: "📰",
      discoverable: true,
    },
    title: "Content Publish Credential",
    description: "A credential representing a publisher publishing a piece of content such as a news article.",

    ...baseVcJsonSchema,

    properties: {
      ...baseVcJsonSchema.properties,
      credentialSubject: {
        $comment: '{"term": "credentialSubject", "@id": "https://www.w3.org/2018/credentials#credentialSubject"}',
        type: "object",
        required: ["id", "publishedContent"],
        properties: {
          id: {
            $comment: '{"term": "id", "@id": "@id"}',
            description: "Publisher DID",
            type: "string",
            format: "uri",
          },
          publishedContent: {
            $comment: '{"term": "publishedContent", "@id": "publishedContent"}',
            type: "object",
            required: ["id", "headline", "url", "datePublished", "publisher"],
            properties: {
              id: {
                $comment: '{"term": "id", "@id": "@id"}',
                description: "Globally unique identifier for this piece of content across all versions",
                type: "string",
              },
              versionId: {
                $comment: '{"term": "versionId", "@id": "http://schema.org/version"}',
                description: "Globally unique identifier that refers to this version of this piece of content",
                type: "string",
              },
              headline: {
                $comment: '{"term": "headline", "@id": "https://schema.org/headline"}',
                type: "string",
              },
              description: {
                $comment: '{"term": "description", "@id": "https://schema.org/description"}',
                type: "string",
              },
              url: {
                $comment: '{"term": "url", "@id": "https://schema.org/URL"}',
                type: "string",
                format: "uri",
              },
              datePublished: {
                $comment: '{"term": "datePublished", "@id": "https://schema.org/datePublished"}',
                type: "string",
                format: "date-time",
              },
              dateModified: {
                $comment: '{"term": "dateModified", "@id": "https://schema.org/dateModified"}',
                type: "string",
                format: "date-time",
              },
              publisher: {
                $comment: '{"term": "publisher", "@id": "https://schema.org/publisher"}',
                type: "object",
                required: ["name", "url"],
                properties: {
                  id: {
                    $comment: '{"term": "id", "@id": "@id"}',
                    description: "Publisher DID or other unique identifier URI",
                    type: "string",
                    format: "uri",
                  },
                  name: {
                    $comment: '{"term": "name", "@id": "http://schema.org/name"}',
                    type: "string",
                  },
                  url: {
                    $comment: '{"term": "url", "@id": "https://schema.org/URL"}',
                    description: "Publisher homepage",
                    type: "string",
                    format: "uri",
                  },
                },
              },
              author: {
                $comment: '{"term": "author", "@id": "https://schema.org/author"}',
                type: "object",
                required: ["name"],
                properties: {
                  id: {
                    $comment: '{"term": "id", "@id": "@id"}',
                    description: "Author DID or other unique identifier URI",
                    type: "string",
                    format: "uri",
                  },
                  name: {
                    $comment: '{"term": "name", "@id": "http://schema.org/name"}',
                    type: "string",
                  },
                },
              },
              keywords: {
                $comment: '{"term": "keywords", "@id": "http://schema.org/keywords"}',
                description: "Comma-separated list of tags/keywords",
                type: "string",
              },
              image: {
                $comment: '{"term": "image", "@id": "http://schema.org/image"}',
                type: "string",
                format: "uri",
              },
              rawContentUrl: {
                $comment: '{"term": "rawContentUrl", "@id": "http://schema.org/URL"}',
                description:
                  "URL where raw, machine-readable, full text of content can be found (may require authentication)",
                type: "string",
                format: "uri",
              },
              rawContentHash: {
                $comment: '{"term": "rawContentHash", "@id": "http://schema.org/Text"}',
                description: "Keccak-256 hash of content at `rawContentUrl`",
                type: "string",
              },
            },
          },
        },
      },
    },
  },
  TestCredential: {
    $schema: "http://json-schema.org/draft-07/schema#",
    $id: "https://example.com/schemas/test-credential/json-schema.json",
    $comment: '{"term": "TestCredential", "@id": "https://example.com/schemas/test-credential/ld-context.json#"}',
    $metadata: {
      uris: {
        jsonLdContext: "https://example.com/schemas/test-credential/ld-context.json",
        jsonSchema: "https://example.com/schemas/test-credential/json-schema.json",
      },
      version: "1.0",
      slug: "test-credential",
      icon: "🧪",
      discoverable: true,
    },
    title: "Test Credential",
    description: "A flat test credential with all of the data types supported by our wizard UIs.",

    ...baseVcJsonSchema,

    properties: {
      ...baseVcJsonSchema.properties,
      credentialSubject: {
        $comment: '{"term": "credentialSubject", "@id": "https://www.w3.org/2018/credentials#credentialSubject"}',
        type: "object",
        required: ["id", "headline", "url", "date"],
        properties: {
          id: {
            $comment: '{"term": "id", "@id": "@id"}',
            title: "Credential Subject ID",
            description: "Globally unique identifier for the piece of content this credential is about",
            type: "string",
            format: "uri",
          },
          headline: {
            $comment: '{"term": "headline", "@id": "https://schema.org/Text"}',
            title: "Headline",
            type: "string",
          },
          description: {
            $comment: '{"term": "description", "@id": "https://schema.org/Text"}',
            title: "Description",
            type: "string",
          },
          url: {
            $comment: '{"term": "url", "@id": "https://schema.org/URL"}',
            title: "URL",
            type: "string",
            format: "uri",
          },
          dateTime: {
            $comment: '{"term": "dateTime", "@id": "https://schema.org/DateTime"}',
            title: "Date & Time",
            type: "string",
            format: "date-time",
          },
          date: {
            $comment: '{"term": "date", "@id": "https://schema.org/Date"}',
            title: "Date",
            type: "string",
            format: "date",
          },
          author: {
            $comment: '{"term": "author", "@id": "author"}',
            title: "Author",
            type: "object",
            required: ["name"],
            properties: {
              id: {
                $comment: '{"term": "id", "@id": "publisher-id"}',
                description: "Author DID or other unique identifier URI",
                type: "string",
              },
              name: {
                $comment: '{"term": "name", "@id": "author-name"}',
                type: "string",
              },
            },
          },
          opinion: {
            $comment: '{"term": "opinion", "@id": "https://schema.org/Boolean"}',
            title: "Opinion",
            type: "boolean",
          },
          numRevisions: {
            $comment: '{"term": "numRevisions", "@id": "https://schema.org/Number"}',
            title: "Number of Revisions",
            type: "number",
          },
        },
      },
    },
  },
  "[no schema]": {
    $schema: "http://json-schema.org/draft-07/schema#",
    ...baseVcJsonSchema,
  },
};

export const EXAMPLE_JSON_LD_SCHEMAS: { [key: string]: string } = {
  DiplomaCredential: `{
  "@context": {
    "@version": 1.1,
    "@rootType": "DiplomaCredential",
    "@title": "Diploma Credential",
    "@metadata": {
      "uris": {
        "jsonLdContext": "https://beta.api.schemas.serto.id/v1/public/diploma-credential/ld-context.json",
        "jsonSchema": "https://beta.api.schemas.serto.id/v1/public/diploma-credential/json-schema.json"
      },
      "version": "1.0",
      "slug": "diploma-credential",
      "icon": "🎓",
      "discoverable": true
    },
    "w3ccred": "https://www.w3.org/2018/credentials#",
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "schema-id": "https://beta.api.schemas.serto.id/v1/public/diploma-credential/ld-context.json#",
    "DiplomaCredential": {
      "@id": "schema-id",
      "@contains": "credentialSubject"
    },
    "credentialSubject": {
      "@id": "w3ccred:credentialSubject",
      "@required": true,
      "@contains": ["degreeName", "universityName", "universityId", "graduationDate"],
      "@context": {
        "id": {
          "@id": "@id",
          "@type": "@id",
          "@title": "Alumni ID",
          "@required": true
        }
      }
    },
    "degreeName": {
      "@id": "schema-id:degreeName",
      "@type": "http://schema.org/Text",
      "@required": true,
      "@title": "Degree Name",
      "@description": "E.g. \\"Bachelor of Arts in Astrophysics\\""
    },
    "graduationDate": {
      "@id": "schema-id:graduationDate",
      "@type": "http://schema.org/Date",
      "@required": true,
      "@title": "Graduation Date"
    },
    "universityName": {
      "@id": "schema-id:universityName",
      "@type": "http://schema.org/Text",
      "@required": true,
      "@title": "University Name"
    },
    "universityId": {
      "@id": "schema-id:universityId",
      "@type": "@id",
      "@title": "University ID"
    }
  }
}`,
  ContentPublishCredential: `{
  "@context": {
    "@version": 1.1,
    "@rootType": "ContentPublishCredential",
    "@title": "Content Publish Credential",
    "@description": "A credential representing a publisher publishing a piece of content such as a news article.",
    "@metadata": {
      "uris": {
        "jsonLdContext": "https://example.com/schemas/content-publish-credential/ld-context.json",
        "jsonSchema": "https://example.com/schemas/content-publish-credential/json-schema.json"
      },
      "version": "1.0",
      "slug": "content-publish-credential",
      "icon": "📰",
      "discoverable": true
    },
    "w3ccred": "https://www.w3.org/2018/credentials#",
    "schema-id": "https://example.com/schemas/content-publish-credential/ld-context.json#",
    "ContentPublishCredential": {
      "@id": "schema-id",
      "@contains": "credentialSubject"
    },
    "credentialSubject": {
      "@id": "w3ccred:credentialSubject",
      "@required": true,
      "@contains": "publishedContent",
      "@context": {
        "id": {
          "@id": "@id",
          "@type": "@id",
          "@description": "Publisher DID",
          "@required": true
        }
      }
    },
    "Organization": {
      "@id": "http://schema.org/Organization",
      "@context": {
        "id": {
          "@id": "@id",
          "@type": "@id",
          "@description": "Publisher DID or other unique identifier URI"
        },
        "name": {
          "@id": "http://schema.org/name",
          "@type": "http://schema.org/Text",
          "@required": true
        },
        "url": {
          "@id": "http://schema.org/url",
          "@type": "http://schema.org/URL",
          "@required": true,
          "@description": "Publisher homepage"
        }
      }
    },
    "Person": {
      "@id": "http://schema.org/Person",
      "@context": {
        "id": {
          "@id": "@id",
          "@type": "@id",
          "@description": "Author DID or other unique identifier URI"
        },
        "name": {
          "@id": "http://schema.org/name",
          "@type": "http://schema.org/Text",
          "@required": true
        }
      }
    },
    "Article": {
      "@id": "http://schema.org/Article",
      "@context": {
        "id": {
          "@id": "@id",
          "@type": "http://schema.org/Text",
          "@description": "Globally unique identifier for this piece of content across all versions",
          "@required": true
        },
        "versionId": {
          "@id": "http://schema.org/version",
          "@type": "http://schema.org/Text",
          "@description": "Globally unique identifier that refers to this version of this piece of content"
        },
        "headline": {
          "@id": "http://schema.org/headline",
          "@type": "http://schema.org/Text",
          "@required": true
        },
        "description": {
          "@id": "http://schema.org/description",
          "@type": "http://schema.org/Text"
        },
        "url": {
          "@id": "http://schema.org/url",
          "@type": "http://schema.org/URL",
          "@required": true
        },
        "datePublished": {
          "@id": "http://schema.org/datePublished",
          "@type": "http://schema.org/DateTime",
          "@required": true
        },
        "dateModified": {
          "@id": "http://schema.org/dateModified",
          "@type": "http://schema.org/DateTime"
        },
        "publisher": {
          "@id": "http://schema.org/publisher",
          "@type": "Organization",
          "@required": true,
          "@replaceWith": "Organization"
        },
        "author": {
          "@id": "http://schema.org/author",
          "@type": "Person",
          "@replaceWith": "Person"
        },
        "keywords": {
          "@id": "http://schema.org/keywords",
          "@type": "http://schema.org/Text",
          "@description": "Comma-separated list of tags/keywords"
        },
        "image": {
          "@id": "http://schema.org/image",
          "@type": "http://schema.org/URL"
        },
        "rawContentUrl": {
          "@id": "schema-id:raw-content-url",
          "@type": "http://schema.org/URL",
          "@description": "URL where raw, machine-readable, full text of content can be found (may require authentication)"
        },
        "rawContentHash": {
          "@id": "schema-id:raw-content-hash",
          "@type": "http://schema.org/Text",
          "@description": "Keccak-256 hash of content at \`rawContentUrl\`"
        }
      }
    },
    "publishedContent": {
      "@id": "schema-id:publishedContent",
      "@description": "Data about piece of content this publisher has published",
      "@required": true,
      "@replaceWith": "Article"
    }
  }
}`,
  TestCredential: `{
  "@context": {
    "@version": 1.1,
    "@rootType": "TestCredential",
    "@title": "Test Credential",
    "@description": "A flat test credential with all of the data types supported by our wizard UIs.",
    "@metadata": {
      "uris": {
        "jsonLdContext": "https://example.com/schemas/test-credential/ld-context.json",
        "jsonSchema": "https://example.com/schemas/test-credential/json-schema.json"
      },
      "version": "1.0",
      "slug": "test-credential",
      "icon": "🧪",
      "discoverable": true
    },
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "w3ccred": "https://www.w3.org/2018/credentials#",
    "schema-id": "https://example.com/schemas/test-credential/ld-context.json#",
    "TestCredential": {
      "@id": "schema-id",
      "@contains": "credentialSubject"
    },
    "credentialSubject": {
      "@id": "w3ccred:credentialSubject",
      "@required": true,
      "@context": {
        "id": {
          "@id": "@id",
          "@type": "@id",
          "@title": "Credential Subject ID",
          "@description": "Globally unique identifier for the piece of content this credential is about",
          "@required": true
        },
        "headline": {
          "@title": "Headline",
          "@id": "schema-id:headline",
          "@type": "http://schema.org/Text",
          "@required": true
        },
        "description": {
          "@title": "Description",
          "@id": "schema-id:description",
          "@type": "http://schema.org/Text"
        },
        "url": {
          "@title": "URL",
          "@id": "schema-id:url",
          "@type": "http://schema.org/URL",
          "@required": true
        },
        "dateTime": {
          "@title": "Date & Time",
          "@id": "schema-id:date-time",
          "@type": "http://schema.org/DateTime"
        },
        "date": {
          "@title": "Date",
          "@id": "schema-id:date",
          "@type": "http://schema.org/Date",
          "@required": true
        },
        "author": {
          "@title": "Author",
          "@id": "schema-id:author",
          "@context": {
            "id": {
              "@id": "schema-id:publisher-id",
              "@type": "http://schema.org/Text",
              "@description": "Author DID or other unique identifier URI"
            },
            "name": {
              "@id": "schema-id:author-name",
              "@type": "http://schema.org/Text",
              "@required": true
            }
          }
        },
        "opinion": {
          "@title": "Opinion",
          "@id": "schema-id:opinion",
          "@type": "http://schema.org/Boolean"
        },
        "numRevisions": {
          "@title": "Number of Revisions",
          "@id": "schema-id:num-revisions",
          "@type": "http://schema.org/Number"
        }
      }
    }
  }
}`,
  "W3C base credentials context": `{
  "@context": {
    "@version": 1.1,
    "@protected": true,

    "id": "@id",
    "type": "@type",

    "VerifiableCredential": {
      "@id": "https://www.w3.org/2018/credentials#VerifiableCredential",
      "@context": {
        "@version": 1.1,
        "@protected": true,

        "id": "@id",
        "type": "@type",

        "cred": "https://www.w3.org/2018/credentials#",
        "sec": "https://w3id.org/security#",
        "xsd": "http://www.w3.org/2001/XMLSchema#",

        "credentialSchema": {
          "@id": "cred:credentialSchema",
          "@type": "@id",
          "@context": {
            "@version": 1.1,
            "@protected": true,

            "id": "@id",
            "type": "@type",

            "cred": "https://www.w3.org/2018/credentials#",

            "JsonSchemaValidator2018": "cred:JsonSchemaValidator2018"
          }
        },
        "credentialStatus": {"@id": "cred:credentialStatus", "@type": "@id"},
        "credentialSubject": {"@id": "cred:credentialSubject", "@type": "@id"},
        "evidence": {"@id": "cred:evidence", "@type": "@id"},
        "expirationDate": {"@id": "cred:expirationDate", "@type": "xsd:dateTime"},
        "holder": {"@id": "cred:holder", "@type": "@id"},
        "issued": {"@id": "cred:issued", "@type": "xsd:dateTime"},
        "issuer": {"@id": "cred:issuer", "@type": "@id"},
        "issuanceDate": {"@id": "cred:issuanceDate", "@type": "xsd:dateTime"},
        "proof": {"@id": "sec:proof", "@type": "@id", "@container": "@graph"},
        "refreshService": {
          "@id": "cred:refreshService",
          "@type": "@id",
          "@context": {
            "@version": 1.1,
            "@protected": true,

            "id": "@id",
            "type": "@type",

            "cred": "https://www.w3.org/2018/credentials#",

            "ManualRefreshService2018": "cred:ManualRefreshService2018"
          }
        },
        "termsOfUse": {"@id": "cred:termsOfUse", "@type": "@id"},
        "validFrom": {"@id": "cred:validFrom", "@type": "xsd:dateTime"},
        "validUntil": {"@id": "cred:validUntil", "@type": "xsd:dateTime"}
      }
    },

    "VerifiablePresentation": {
      "@id": "https://www.w3.org/2018/credentials#VerifiablePresentation",
      "@context": {
        "@version": 1.1,
        "@protected": true,

        "id": "@id",
        "type": "@type",

        "cred": "https://www.w3.org/2018/credentials#",
        "sec": "https://w3id.org/security#",

        "holder": {"@id": "cred:holder", "@type": "@id"},
        "proof": {"@id": "sec:proof", "@type": "@id", "@container": "@graph"},
        "verifiableCredential": {"@id": "cred:verifiableCredential", "@type": "@id", "@container": "@graph"}
      }
    },

    "EcdsaSecp256k1Signature2019": {
      "@id": "https://w3id.org/security#EcdsaSecp256k1Signature2019",
      "@context": {
        "@version": 1.1,
        "@protected": true,

        "id": "@id",
        "type": "@type",

        "sec": "https://w3id.org/security#",
        "xsd": "http://www.w3.org/2001/XMLSchema#",

        "challenge": "sec:challenge",
        "created": {"@id": "http://purl.org/dc/terms/created", "@type": "xsd:dateTime"},
        "domain": "sec:domain",
        "expires": {"@id": "sec:expiration", "@type": "xsd:dateTime"},
        "jws": "sec:jws",
        "nonce": "sec:nonce",
        "proofPurpose": {
          "@id": "sec:proofPurpose",
          "@type": "@vocab",
          "@context": {
            "@version": 1.1,
            "@protected": true,

            "id": "@id",
            "type": "@type",

            "sec": "https://w3id.org/security#",

            "assertionMethod": {"@id": "sec:assertionMethod", "@type": "@id", "@container": "@set"},
            "authentication": {"@id": "sec:authenticationMethod", "@type": "@id", "@container": "@set"}
          }
        },
        "proofValue": "sec:proofValue",
        "verificationMethod": {"@id": "sec:verificationMethod", "@type": "@id"}
      }
    },

    "EcdsaSecp256r1Signature2019": {
      "@id": "https://w3id.org/security#EcdsaSecp256r1Signature2019",
      "@context": {
        "@version": 1.1,
        "@protected": true,

        "id": "@id",
        "type": "@type",

        "sec": "https://w3id.org/security#",
        "xsd": "http://www.w3.org/2001/XMLSchema#",

        "challenge": "sec:challenge",
        "created": {"@id": "http://purl.org/dc/terms/created", "@type": "xsd:dateTime"},
        "domain": "sec:domain",
        "expires": {"@id": "sec:expiration", "@type": "xsd:dateTime"},
        "jws": "sec:jws",
        "nonce": "sec:nonce",
        "proofPurpose": {
          "@id": "sec:proofPurpose",
          "@type": "@vocab",
          "@context": {
            "@version": 1.1,
            "@protected": true,

            "id": "@id",
            "type": "@type",

            "sec": "https://w3id.org/security#",

            "assertionMethod": {"@id": "sec:assertionMethod", "@type": "@id", "@container": "@set"},
            "authentication": {"@id": "sec:authenticationMethod", "@type": "@id", "@container": "@set"}
          }
        },
        "proofValue": "sec:proofValue",
        "verificationMethod": {"@id": "sec:verificationMethod", "@type": "@id"}
      }
    },

    "Ed25519Signature2018": {
      "@id": "https://w3id.org/security#Ed25519Signature2018",
      "@context": {
        "@version": 1.1,
        "@protected": true,

        "id": "@id",
        "type": "@type",

        "sec": "https://w3id.org/security#",
        "xsd": "http://www.w3.org/2001/XMLSchema#",

        "challenge": "sec:challenge",
        "created": {"@id": "http://purl.org/dc/terms/created", "@type": "xsd:dateTime"},
        "domain": "sec:domain",
        "expires": {"@id": "sec:expiration", "@type": "xsd:dateTime"},
        "jws": "sec:jws",
        "nonce": "sec:nonce",
        "proofPurpose": {
          "@id": "sec:proofPurpose",
          "@type": "@vocab",
          "@context": {
            "@version": 1.1,
            "@protected": true,

            "id": "@id",
            "type": "@type",

            "sec": "https://w3id.org/security#",

            "assertionMethod": {"@id": "sec:assertionMethod", "@type": "@id", "@container": "@set"},
            "authentication": {"@id": "sec:authenticationMethod", "@type": "@id", "@container": "@set"}
          }
        },
        "proofValue": "sec:proofValue",
        "verificationMethod": {"@id": "sec:verificationMethod", "@type": "@id"}
      }
    },

    "RsaSignature2018": {
      "@id": "https://w3id.org/security#RsaSignature2018",
      "@context": {
        "@version": 1.1,
        "@protected": true,

        "challenge": "sec:challenge",
        "created": {"@id": "http://purl.org/dc/terms/created", "@type": "xsd:dateTime"},
        "domain": "sec:domain",
        "expires": {"@id": "sec:expiration", "@type": "xsd:dateTime"},
        "jws": "sec:jws",
        "nonce": "sec:nonce",
        "proofPurpose": {
          "@id": "sec:proofPurpose",
          "@type": "@vocab",
          "@context": {
            "@version": 1.1,
            "@protected": true,

            "id": "@id",
            "type": "@type",

            "sec": "https://w3id.org/security#",

            "assertionMethod": {"@id": "sec:assertionMethod", "@type": "@id", "@container": "@set"},
            "authentication": {"@id": "sec:authenticationMethod", "@type": "@id", "@container": "@set"}
          }
        },
        "proofValue": "sec:proofValue",
        "verificationMethod": {"@id": "sec:verificationMethod", "@type": "@id"}
      }
    },

    "proof": {"@id": "https://w3id.org/security#proof", "@type": "@id", "@container": "@graph"}
  }
}`,
};

export const EXAMPLE_VCS: { [key: string]: VC } = {
  DiplomaCredential: {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://beta.api.schemas.serto.id/v1/public/diploma-credential/1.2/ld-context.json",
    ],
    type: ["VerifiableCredential", "DiplomaCredential"],
    issuer: { id: "did:web:beta.agent.serto.id" },
    issuanceDate: "2021-10-13T21:57:34.000Z",
    credentialSubject: {
      id: "did:ethr:0x02f4b0ceed160cccb47a66951baffac8a8ace75c33b761beb545e3ec99f44300fc",
      degreeName: "Bachelor of Science in Examples",
      universityName: "Example University",
      graduationDate: "2012-10-31",
      universityId: "did:ethr:rinkeby:0x9fb04797cc0b1711c86b960105e0c3ed3f9cb749",
    },
    credentialSchema: {
      id: "https://beta.api.schemas.serto.id/v1/public/diploma-credential/1.2/json-schema.json",
      type: "JsonSchemaValidator2018",
    },
    proof: {
      type: "JwtProof2020",
      jwt:
        "eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJjcmVkZW50aWFsU3ViamVjdCI6eyJ1bml2ZXJzaXR5SWQiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4OWZiMDQ3OTdjYzBiMTcxMWM4NmI5NjAxMDVlMGMzZWQzZjljYjc0OSIsInVuaXZlcnNpdHlOYW1lIjoiRXhhbXBsZSBVbml2ZXJzaXR5IiwiZ3JhZHVhdGlvbkRhdGUiOiIyMDEyLTEwLTMxIiwiZGVncmVlTmFtZSI6IkJhY2hlbG9yIG9mIFNjaWVuY2UgaW4gRXhhbXBsZXMifSwiQGNvbnRleHQiOlsiaHR0cHM6Ly93d3cudzMub3JnLzIwMTgvY3JlZGVudGlhbHMvdjEiLCJodHRwczovL2JldGEuYXBpLnNjaGVtYXMuc2VydG8uaWQvdjEvcHVibGljL2RpcGxvbWEtY3JlZGVudGlhbC8xLjIvbGQtY29udGV4dC5qc29uIl0sInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiLCJEaXBsb21hQ3JlZGVudGlhbCJdfSwiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vYmV0YS5hcGkuc2NoZW1hcy5zZXJ0by5pZC92MS9wdWJsaWMvZGlwbG9tYS1jcmVkZW50aWFsLzEuMi9qc29uLXNjaGVtYS5qc29uIiwidHlwZSI6Ikpzb25TY2hlbWFWYWxpZGF0b3IyMDE4In0sInN1YiI6ImRpZDpldGhyOjB4MDJmNGIwY2VlZDE2MGNjY2I0N2E2Njk1MWJhZmZhYzhhOGFjZTc1YzMzYjc2MWJlYjU0NWUzZWM5OWY0NDMwMGZjIiwibmJmIjoxNjM0MTYyMjU0LCJpc3MiOiJkaWQ6d2ViOmJldGEuYWdlbnQuc2VydG8uaWQifQ.GHlgeeT0BsqbAm5ZDKBoNLqE6wn5AoBywdscGK5mIV1OUAymkhxAjzeuJhFvsoW0kJl56Vq1JIVOAGqCsM6x5w",
    },
  },
  ContentPublishCredential: {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://example.com/schemas/content-publish-credential/ld-context.json",
    ],
    id: "did:example:publisher-did#credential-id",
    type: ["VerifiableCredential", "ContentPublishCredential"],
    issuer: "did:example:publisher-did",
    issuanceDate: "2017-12-05T14:27:42Z",
    credentialSubject: {
      id: "did:example:publisher-did",
      publishedContent: {
        "@type": "Article",
        id: "did:example:publisher-did#article-id",
        versionId: "did:example:publisher-did#article-version-id",
        headline: "A Very Important Article",
        description: "This important article covers important things you should know about.",
        url: "https://example-publisher.com/articles/a-very-important-article",
        datePublished: "2020-06-29T00:04:12.418Z",
        dateModified: "2020-06-30T00:10:45.000Z",
        image: "https://example-publisher.com/images/important-article-primary-image.jpg",
        rawContentUrl: "https://example-publisher.com/raw-content?id=did:example:publisher-did#article-id",
        rawContentHash: "0x123abc",
        keywords: "news, breaking news, politics",
        publisher: {
          id: "did:example:publisher-did",
          type: "Organization",
          name: "Example Publisher",
          url: "https://example-publisher.com/",
        },
        author: {
          id: "did:example:publisher-did#author-id",
          type: "Person",
          name: "Joe Reporter",
        },
      },
    },
  },
  "[no schema]": {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    type: ["VerifiableCredential"],
    issuer: "did:example:publisher-did",
    issuanceDate: "2017-12-05T14:27:42Z",
    credentialSubject: {
      "hi there": "these are the minimum required properties for all VCs - if you remove any, this VC won't validate",
    },
  },
};
