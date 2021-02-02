import { getSchemaUrl } from "./utils";

export const EXAMPLE_SCHEMAS: { [key: string]: string } = {
  DiplomaCredential: `{
  "@context": {
    "@version": 1.1,
    "@rootType": "DiplomaCredential",
    "@title": "Diploma Credential",
    "@metadata": {
      "version": "1.0",
      "slug": "diploma-credential",
      "icon": "🎓",
      "discoverable": true
    },
    "w3ccred": "https://www.w3.org/2018/credentials#",
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "schema-id": "${getSchemaUrl("diploma-credential", "ld-context-plus")}#",
    "DiplomaCredential": {
      "@id": "schema-id",
      "@contains": "credentialSubject"
    },
    "credentialSubject": {
      "@id": "w3ccred:credentialSubject",
      "@required": true,
      "@contains": ["degreeName", "universityName", "universityId", "year"],
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
      "@type": "rdf:HTML",
      "@dataType": "string",
      "@required": true,
      "@title": "Degree Name",
      "@description": "E.g. \\"Bachelor of Arts in Astrophysics\\""
    },
    "universityName": {
      "@id": "schema-id:universityName",
      "@type": "rdf:HTML",
      "@dataType": "string",
      "@required": true,
      "@title": "University Name"
    },
    "universityId": {
      "@id": "schema-id:universityId",
      "@type": "rdf:langString",
      "@dataType": "string",
      "@title": "University ID"
    },
    "year": {
      "@id": "schema-id:year",
      "@type": "rdf:langString",
      "@dataType": "integer",
      "@title": "Year"
    }
  }
}`,
  ContentPublishCredential: `{
  "@context": {
    "@version": 1.1,
    "@rootType": "ContentPublishCredential",
    "@title": "Content Publish Credential",
    "@metadata": {
      "version": "1.0",
      "slug": "content-publish-credential",
      "icon": "📰",
      "discoverable": true
    },
    "w3ccred": "https://www.w3.org/2018/credentials#",
    "schema-id": "${getSchemaUrl("content-publish-credential", "ld-context-plus")}#",
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
  "ContentPublishCredential (programmatic)": `{
  "@context": {
    "@version": 1.1,
    "@rootType": "ContentPublishCredential",
    "@title": "Content Publish Credential",
    "@metadata": {
      "version": "1.0",
      "slug": "content-publish-credential",
      "icon": "📰",
      "discoverable": true
    },
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "w3ccred": "https://www.w3.org/2018/credentials#",
    "schema-id": "${getSchemaUrl("content-publish-credential", "ld-context-plus")}#",
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
    "publishedContent": {
      "@id": "schema-id:publishedContent",
      "@description": "Data about piece of content this publisher has published",
      "@required": true,
      "@context": {
        "id": {
          "@id": "@id",
          "@type": "xsd:string",
          "@description": "Globally unique identifier for this piece of content across all versions",
          "@required": true
        },
        "versionId": {
          "@id": "http://schema.org/version",
          "@type": "xsd:string",
          "@description": "Globally unique identifier that refers to this version of this piece of content"
        },
        "headline": {
          "@id": "schema-id:headline",
          "@type": "xsd:string",
          "@required": true
        },
        "description": {
          "@id": "schema-id:description",
          "@type": "xsd:string"
        },
        "url": {
          "@id": "schema-id:url",
          "@type": "xsd:anyURI",
          "@required": true
        },
        "datePublished": {
          "@id": "schema-id:date-published",
          "@type": "xsd:dateTime",
          "@required": true
        },
        "dateModified": {
          "@id": "schema-id:date-modified",
          "@type": "xsd:dateTime"
        },
        "publisher": {
          "@id": "schema-id:publisher",
          "@required": true,
          "@context": {
            "id": {
              "@id": "schema-id:publisher-id",
              "@type": "xsd:string",
              "@description": "Publisher DID or other unique identifier URI"
            },
            "name": {
              "@id": "schema-id:publisher-name",
              "@type": "xsd:string",
              "@required": true
            },
            "url": {
              "@id": "schema-id:publisher-url",
              "@type": "xsd:anyURI",
              "@required": true,
              "@description": "Publisher homepage"
            }
          }
        },
        "author": {
          "@id": "schema-id:author",
          "@context": {
            "id": {
              "@id": "schema-id:publisher-id",
              "@type": "xsd:string",
              "@description": "Author DID or other unique identifier URI"
            },
            "name": {
              "@id": "schema-id:author-name",
              "@type": "xsd:string",
              "@required": true
            }
          }
        },
        "keywords": {
          "@id": "schema-id:keywords",
          "@type": "xsd:string",
          "@description": "Comma-separated list of tags/keywords"
        },
        "image": {
          "@id": "schema-id:image",
          "@type": "xsd:anyURI"
        },
        "rawContentUrl": {
          "@id": "schema-id:raw-content-url",
          "@type": "xsd:anyURI",
          "@description": "URL where raw, machine-readable, full text of content can be found (may require authentication)"
        },
        "rawContentHash": {
          "@id": "schema-id:raw-content-hash",
          "@type": "xsd:string",
          "@description": "Keccak-256 hash of content at \`rawContentUrl\`"
        }
      }
    }
  }
}`,
  "ContentPublishCredential (flat)": `{
  "@context": {
    "@version": 1.1,
    "@rootType": "ContentPublishCredential",
    "@title": "Content Publish Credential",
    "@metadata": {
      "version": "1.0",
      "slug": "content-publish-credential",
      "icon": "📰",
      "discoverable": true
    },
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "w3ccred": "https://www.w3.org/2018/credentials#",
    "schema-id": "${getSchemaUrl("content-publish-credential", "ld-context-plus")}#",
    "ContentPublishCredential": {
      "@id": "schema-id",
      "@contains": "credentialSubject"
    },
    "credentialSubject": {
      "@id": "w3ccred:credentialSubject",
      "@required": true,
      "@context": {
        "publisherId": {
          "@id": "@id",
          "@type": "@id",
          "@description": "Publisher DID",
          "@required": true
        },
        "id": {
          "@id": "@id",
          "@type": "xsd:string",
          "@description": "Globally unique identifier for this piece of content across all versions",
          "@required": true
        },
        "versionId": {
          "@id": "http://schema.org/version",
          "@type": "xsd:string",
          "@description": "Globally unique identifier that refers to this version of this piece of content"
        },
        "headline": {
          "@id": "schema-id:headline",
          "@type": "xsd:string",
          "@required": true
        },
        "description": {
          "@id": "schema-id:description",
          "@type": "xsd:string"
        },
        "url": {
          "@id": "schema-id:url",
          "@type": "xsd:anyURI",
          "@required": true
        },
        "datePublished": {
          "@id": "schema-id:date-published",
          "@type": "xsd:dateTime",
          "@required": true
        },
        "dateModified": {
          "@id": "schema-id:date-modified",
          "@type": "xsd:dateTime"
        },
        "publisher": {
          "@id": "schema-id:publisher",
          "@required": true,
          "@context": {
            "id": {
              "@id": "schema-id:publisher-id",
              "@type": "xsd:string",
              "@description": "Publisher DID or other unique identifier URI"
            },
            "name": {
              "@id": "schema-id:publisher-name",
              "@type": "xsd:string",
              "@required": true
            },
            "url": {
              "@id": "schema-id:publisher-url",
              "@type": "xsd:anyURI",
              "@required": true,
              "@description": "Publisher homepage"
            }
          }
        },
        "author": {
          "@id": "schema-id:author",
          "@context": {
            "id": {
              "@id": "schema-id:publisher-id",
              "@type": "xsd:string",
              "@description": "Author DID or other unique identifier URI"
            },
            "name": {
              "@id": "schema-id:author-name",
              "@type": "xsd:string",
              "@required": true
            }
          }
        },
        "keywords": {
          "@id": "schema-id:keywords",
          "@type": "xsd:string",
          "@description": "Comma-separated list of tags/keywords"
        },
        "image": {
          "@id": "schema-id:image",
          "@type": "xsd:anyURI"
        },
        "rawContentUrl": {
          "@id": "schema-id:raw-content-url",
          "@type": "xsd:anyURI",
          "@description": "URL where raw, machine-readable, full text of content can be found (may require authentication)"
        },
        "rawContentHash": {
          "@id": "schema-id:raw-content-hash",
          "@type": "xsd:string",
          "@description": "Keccak-256 hash of content at \`rawContentUrl\`"
        }
      }
    }
  }
}`,
  "ContentPublishCredential (minimal)": `{
  "@context": {
    "@version": 1.1,
    "@rootType": "ContentPublishCredential",
    "@metadata": {
      "version": "1.0",
      "slug": "content-publish-credential",
      "icon": "📰",
      "discoverable": true
    },
    "w3ccred": "https://www.w3.org/2018/credentials#",
    "schema-id": "${getSchemaUrl("content-publish-credential", "ld-context-plus")}#",
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
          "@required": true
        }
      }
    },
    "publishedContent": {
      "@id": "schema-id:publishedContent",
      "@description": "Data about piece of content this publisher has published",
      "@required": true,
      "@context": {
        "url": {
          "@id": "http://schema.org/url",
          "@type": "http://schema.org/URL",
          "@required": true
        }
      }
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
      "version": "1.0",
      "slug": "test-credential",
      "icon": "🧪",
      "discoverable": true
    },
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "w3ccred": "https://www.w3.org/2018/credentials#",
    "schema-id": "${getSchemaUrl("test-credential", "ld-context-plus")}#",
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
        "datePublished": {
          "@title": "Date Published",
          "@id": "schema-id:date-published",
          "@type": "http://schema.org/DateTime",
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
  "[no schema]": `{}`,
};

export const EXAMPLE_VCS: { [key: string]: string } = {
  DiplomaCredential: `{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1"
  ],
  "type": ["VerifiableCredential", "DiplomaCredential"],
  "issuer": "did:ethr:rinkeby:0x9fb04797cc0b1711c86b960105e0c3ed3f9cb749",
  "issuanceDate": "2017-12-05T14:27:42Z",
  "credentialSubject": {
    "id": "did:ethr:rinkeby:0x9fb04797cc0b1711c86b960105e0c3ed3f9cb749",
    "title": "Diploma Credential",
    "degreeName": "Bachelor of Science in Examples",
    "universityName": "Example University",
    "universityId": "did:example:c276e12ec21"
  }
}`,
  ContentPublishCredential: `{
  "@context": [
    "https://www.w3.org/2018/credentials/v1"
  ],
  "id": "did:example:publisher-did#credential-id",
  "type": ["VerifiableCredential", "ContentPublishCredential"],
  "issuer": "did:example:publisher-did",
  "issuanceDate": "2017-12-05T14:27:42Z",
  "credentialSubject": {
    "id": "did:example:publisher-did",
    "publishedContent": {
      "@type": "Article",
      "id": "did:example:publisher-did#article-id",
      "versionId": "did:example:publisher-did#article-version-id",
      "headline": "A Very Important Article",
      "description": "This important article covers important things you should know about.",
      "url": "https://example-publisher.com/articles/a-very-important-article",
      "datePublished": "2020-06-29T00:04:12.418Z",
      "dateModified": "2020-06-30T00:10:45.000Z",
      "image": "https://example-publisher.com/images/important-article-primary-image.jpg",
      "rawContentUrl": "https://example-publisher.com/raw-content?id=did:example:publisher-did#article-id",
      "rawContentHash": "0x123abc",
      "keywords": "news, breaking news, politics",
      "publisher": {
        "id": "did:example:publisher-did",
        "type": "Organization",
        "name": "Example Publisher",
        "url": "https://example-publisher.com/"
      },
      "author": {
        "id": "did:example:publisher-did#author-id",
        "type": "Person",
        "name": "Joe Reporter"
      }
    }
  }
}`,
  "ContentPublishCredential (programmatic)": `{
  "@context": [
    "https://www.w3.org/2018/credentials/v1"
  ],
  "id": "did:example:publisher-did#credential-id",
  "type": ["VerifiableCredential", "ContentPublishCredential"],
  "issuer": "did:example:publisher-did",
  "issuanceDate": "2017-12-05T14:27:42Z",
  "credentialSubject": {
    "id": "did:example:publisher-did",
    "publishedContent": {
      "id": "did:example:publisher-did#article-id",
      "versionId": "did:example:publisher-did#article-version-id",
      "headline": "A Very Important Article",
      "description": "This important article covers important things you should know about.",
      "url": "https://example-publisher.com/articles/a-very-important-article",
      "datePublished": "2020-06-29T00:04:12.418Z",
      "dateModified": "2020-06-30T00:10:45.000Z",
      "image": "https://example-publisher.com/images/important-article-primary-image.jpg",
      "rawContentUrl": "https://example-publisher.com/raw-content?id=did:example:publisher-did#article-id",
      "rawContentHash": "0x123abc",
      "keywords": "news, breaking news, politics",
      "publisher": {
        "id": "did:example:publisher-did",
        "name": "Example Publisher",
        "url": "https://example-publisher.com/"
      },
      "author": {
        "id": "did:example:publisher-did#author-id",
        "name": "Joe Reporter"
      }
    }
  }
}`,
  "ContentPublishCredential (minimal)": `{
  "@context": [
    "https://www.w3.org/2018/credentials/v1"
  ],
  "id": "did:example:publisher-did#credential-id",
  "type": ["VerifiableCredential", "ContentPublishCredential"],
  "issuer": "did:example:publisher-did",
  "issuanceDate": "2017-12-05T14:27:42Z",
  "credentialSubject": {
    "id": "did:example:publisher-did",
    "publishedContent": {
      "url": "https://example-publisher.com/articles/a-very-important-article"
    }
  }
}`,
  "[no schema]": `{
  "@context": [
    "https://www.w3.org/2018/credentials/v1"
  ],
  "type": ["VerifiableCredential"],
  "issuer": "did:example:publisher-did",
  "issuanceDate": "2017-12-05T14:27:42Z",
  "credentialSubject": {
    "hi there": "these are the minimum required properties for all VCs - if you remove any, this VC won't validate"
  }
}`,
};
