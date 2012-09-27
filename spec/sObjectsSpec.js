describe('sObjects.js', function() {

  beforeEach(function() {
    subject = new SOSL();
    sObjects = {
      KnowledgeArticleVersion: {
        name: "KnowledgeArticleVersion",
        getName: function() {
          return this.name;
        }
      },
      User: {
        name: "User",
        getName: function() {
          return this.name;
        }
      },
      Contact: {
        name: "Contact",
        getName: function() {
          return this.name;
        }
      },
      Lead: {
        name: "Lead",
        getName: function() {
          return this.name;
        }
      },
      Account: {
        name: "Account",
        getName: function() {
          return this.name;
        }
      },
      CustomObject_c: {
        name: "CustomObject_c",
        getName: function() {
          return this.name;
        }
      },
      CustomObject_c: {
        name: "CustomObject_c",
        getName: function() {
          return this.name;
        }
      },
      Lead: {
        name: "Lead",
        getName: function() {
          return this.name;
        }
      },
      RecordType: {
        name: "RecordType",
        getName: function() {
          return this.name;
        }
      },
      Pricebook: {
        name: "Pricebook",
        getName: function() {
          return this.name;
        }
      },
      FooBar: {
        name: "FooBar",
        getName: function() {
          return this.name;
        }
      },
      Opportunity: {
        name: "Opportunity",
        getName: function() {
          return this.name;
        }
      }
    }
  });

  describe('.find()', function() {

    it('creates a query for finding single terms', function() {
      expect(
        subject.find(['MyProspect']).raw()
      ).toEqual("FIND {MyProspect}");

      expect(
        subject.find(['mylogin@mycompany.com']).raw()
      ).toEqual("FIND {mylogin@mycompany.com}");

      expect(
        subject.find(['FIND']).raw()
      ).toEqual("FIND {FIND}");

      expect(
        subject.find(['IN']).raw()
      ).toEqual("FIND {IN}");

      expect(
        subject.find(['RETURNING']).raw()
      ).toEqual("FIND {RETURNING}");

      expect(
        subject.find(['LIMIT']).raw()
      ).toEqual("FIND {LIMIT}");
    });

    it('creates a query for a single phrase', function() {
      expect(
        subject.find(['John Smith']).raw()
      ).toEqual('FIND {John Smith}')
    });

    it('creates a query for a Term OR Term', function() {
      expect(
        subject.find(['MyProspect']).or(['MyCompany']).raw()
      ).toEqual('FIND {MyProspect OR MyCompany}')
    });

    it('creates a query for a Term AND Term', function() {
      expect(
        subject.find(['MyProspect']).and(['MyCompany']).raw()
      ).toEqual('FIND {MyProspect AND MyCompany}')
    });

    it('creates a query for a Term AND Phrase', function() {
      expect(
        subject.find(['MyProspect']).and(['\"John Smith\"']).raw()
      ).toEqual('FIND {MyProspect AND "John Smith"}')
    });

    it('creates a query for a Term OR Phrase', function() {
      expect(
        subject.find(['MyProspect']).or(['\"John Smith\"']).raw()
      ).toEqual('FIND {MyProspect OR "John Smith"}')
    });

    it('creates a query for a Complex query using AND/OR', function() {
      expect(
        subject.find(['MyProspect']).and(['\"John Smith\"']).
          or(['MyCompany']).
          raw()
      ).toEqual('FIND {MyProspect AND "John Smith" OR MyCompany}')
    });

    it('creates a query for a Complex query using AND NOT', function() {
      expect(
        subject.find(['MyProspect']).andNot(['MyCompany']).
          raw()
      ).toEqual('FIND {MyProspect AND NOT MyCompany}')
    });

    it('creates a query for a Wildcard search', function() {
      expect(
        subject.find(['My*']).raw()
      ).toEqual('FIND {My*}')
    });

    it('creates a query for a Escape sequences', function() {
      expect(
        subject.find(['Why not?']).raw()
      ).toEqual('FIND {Why not\?}')
    });

    it('creates a query for a Invalid or incomplete phrase (will not succeed)', function() {
      expect(
          subject.find(['\"John Smith']).raw()
      ).toEqual('FIND {"John Smith}')
    });

  });

  describe('.in()', function() {

    it('creates a query for no search group', function() {
      expect(
        subject.find(['MyProspect']).in().raw()
      ).toEqual("FIND {MyProspect}");
    });

    it('creates a query for all fields', function() {
      expect(
        subject.find(['MyProspect']).inAllFields().raw()
      ).toEqual("FIND {MyProspect} IN ALL FIELDS");
    });

    it('creates a query for email fields', function() {
      expect(
        subject.find(['mylogin@mycompany.com']).inEmailFields().raw()
      ).toEqual("FIND {mylogin@mycompany.com} IN EMAIL FIELDS");
    });

    it('creates a query for name fields', function() {
      expect(
        subject.find(['MyProspect']).inNameFields().raw()
      ).toEqual("FIND {MyProspect} IN NAME FIELDS");
    });

    it('creates a query for phone fields', function() {
      expect(
        subject.find(['MyProspect']).inPhoneFields().raw()
      ).toEqual("FIND {MyProspect} IN PHONE FIELDS");
    });

    it('creates a query for sidebar fields', function() {
      expect(
        subject.find(['MyProspect']).inSidebarFields().raw()
      ).toEqual("FIND {MyProspect} IN SIDEBAR FIELDS");
    });

    it('creates a query for invalid search (will not succeed)', function() {
      expect(
        subject.find(['MyProspect']).in('Accounts').raw()
      ).toEqual("FIND {MyProspect} IN Accounts");
    });

  });

  describe('.returning()', function() {

    it('creates a query with no sObject, no fields', function() {
      expect(
        subject.find(['MyProspect']).raw()
      ).toEqual("FIND {MyProspect}");
    });

    it('creates a query with one sObject, no fields', function() {
      expect(
        subject.find(['MyProspect']).
          returning(sObjects.Contact).
          raw()
      ).toEqual("FIND {MyProspect} RETURNING Contact");
    });

    it('creates a query with multiple sObjects, no fields', function() {
      expect(
        subject.find(['MyProspect']).
          returning(sObjects.Contact).
          returning(sObjects.Lead).
          raw()
      ).toEqual("FIND {MyProspect} RETURNING Contact, Lead");
    });

    it('creates a query with one sObjects, one or more fields', function() {
      expect(
        subject.find(['MyProspect']).
          returning(sObjects.Account, ['Name']).
          raw()
      ).toEqual("FIND {MyProspect} RETURNING Account(Name)");

      expect(
        subject.find(['MyProspect']).
          returning(sObjects.Contact, ['FirstName', 'LastName']).
          raw()
      ).toEqual("FIND {MyProspect} RETURNING Contact(FirstName, LastName)");
    });

    it('creates a query for a custom sObject', function() {
      expect(
        subject.find(['MyProspect']).
          returning(sObjects.CustomObject_c).
          raw()
      ).toEqual("FIND {MyProspect} RETURNING CustomObject_c");
    });

    it('creates a query for a custom sObject and one or more custom fields', function() {
      expect(
        subject.find(['MyProspect']).
          returning(sObjects.CustomObject_c, ['CustomField1__c']).
          raw()
      ).toEqual("FIND {MyProspect} RETURNING CustomObject_c(CustomField1__c)");

      expect(
        subject.find(['MyProspect']).
          returning(sObjects.CustomObject_c, ['CustomField1__c', 'CustomField2__c']).
          raw()
      ).toEqual("FIND {MyProspect} RETURNING CustomObject_c(CustomField1__c, CustomField2__c)");
    });

    it('creates a query for multiple sObject objects, one or more fields, limits', function() {
      expect(
        subject.find(['MyProspect']).
          returning(sObjects.Contact, ['FirstName', 'LastName'], 10).
          returning(sObjects.Account, ['Name', 'Industry']).
          raw()
      ).toEqual("FIND {MyProspect} RETURNING Contact(FirstName, LastName LIMIT 10), Account(Name, Industry)");
    });

    it('creates a query for multiple sObject objects, mixed number of fields', function() {
      expect(
        subject.find(['MyProspect']).
          returning(sObjects.Contact, ['FirstName', 'LastName']).
          returning(sObjects.Account).
          returning(sObjects.Lead, ['FirstName']).
          raw()
      ).toEqual("FIND {MyProspect} RETURNING Contact(FirstName, LastName), Account, Lead(FirstName)");
    });

    it('creates a query for unsearchable sObject objects', function() {
      expect(
        subject.find(['MyProspect']).
          returning(sObjects.RecordType).
          raw()
      ).toEqual("FIND {MyProspect} RETURNING RecordType");

      expect(
        subject.find(['MyProspect']).
          returning(sObjects.Pricebook).
          raw()
      ).toEqual("FIND {MyProspect} RETURNING Pricebook");
    });

    it('creates a query for invalid sObject objects', function() {
      expect(
        subject.find(['MyProspect']).
          returning(sObjects.FooBar).
          raw()
      ).toEqual("FIND {MyProspect} RETURNING FooBar");
    });

    it('creates a query for invalid sObject field', function() {
      expect(
        subject.find(['MyProspect']).
          returning(sObjects.Contact, ['fooBar']).
          raw()
      ).toEqual("FIND {MyProspect} RETURNING Contact(fooBar)");
    });

    it('creates a query for single object limit', function() {
      expect(
        subject.find(['MyProspect']).
          returning(sObjects.Contact, ['FirstName', 'LastName'], 10).
          raw()
      ).toEqual("FIND {MyProspect} RETURNING Contact(FirstName, LastName LIMIT 10)");
    });

    it('creates a query for multiple object limits and a query limit', function() {
      expect(
        subject.find(['MyProspect']).
          returning(sObjects.Contact, ['FirstName', 'LastName'], 20).
          returning(sObjects.Account, ['Name', 'Industry'], 10).
          returning(sObjects.Opportunity).
          limit(50).
          raw()
      ).toEqual("FIND {MyProspect} RETURNING Contact(FirstName, LastName LIMIT 20), Account(Name, Industry LIMIT 10), Opportunity LIMIT 50");
    });

  });

  describe('.where()', function() {

    it('creates a query using the appropriate where condition', function() {
      expect(
        subject.find(['test']).
          returning(sObjects.Account, ['Id']).where('createddate').equals('THIS_FISCAL_QUARTER').
          raw()
      ).toEqual("FIND {test} RETURNING Account (id WHERE createddate = THIS_FISCAL_QUARTER)");
    });

    it('creates a query using the appropriate where condition', function() {
      expect(
        subject.find(['test']).
          returning(sObjects.Account, ['Id']).where('cf__c').includes('AAA').
          raw()
      ).toEqual("FIND {test} RETURNING Account (id WHERE cf__c includes('AAA'))");
    });

    it('creates a query using the appropriate where condition', function() {
      expect(
        subject.find(['test']).
          returning(sObjects.Account, ['Id']).
          returning(sObjects.User, ['Field1', 'Field2']).
            where('Field1').equals('test').
              orderByAsc('id').
              orderByDesc('Name').
          raw()
      ).toEqual("FIND {test} RETURNING Account (id), User(Field1,Field2 WHERE Field1 = 'test' order by id ASC, Name DESC)");
    });

    it('creates a query using the appropriate where condition', function() {
      expect(
        subject.find(['test']).inAllFields().
          returning(sObjects.Contact, ['Salutation', 'FirstName', 'LastName', 'AccountId']).
            where('name').equals('test').
          returning(sObjects.User, ['FirstName', 'LastName']).
          returning(sObjects.Account, ['Id']).
            where('BillingState').in(['California', 'New York']).
          raw()
      ).toEqual("FIND {test} IN ALL FIELDS RETURNING Contact(Salutation, FirstName, LastName, AccountId WHERE Name = 'test'), User(FirstName, LastName), Account(id WHERE BillingState IN ('California', 'New York'))");
    });

    it('creates a query using the appropriate where condition', function() {
      expect(
        subject.find(['test']).
          returning(sObjects.Account, ['Id']).
            where('Name').equals('New Account').and().
            where('id').not().equals('null').or().notEquals('null').
            raw()
        ).toEqual("FIND {test} RETURNING Account (id WHERE (Name  = 'New Account' and ((not Id = null) or Id != null)) or (Id = '001z00000008Vq7'and Name = 'Account Insert Test') or (NumberOfEmployees < 100 or NumberOfEmployees = null) ORDER BY NumberOfEmployees)");
    });

    it('creates a query using the appropriate where condition', function() {
      expect(
        subject.find(['tourism']).
          returning(sObjects.KnowledgeArticleVersion, ['Id', 'Title']).
          where('Id').equals('ka0D0000000025eIAA').
          raw()
      ).toEqual("FIND {tourism} RETURNING KnowledgeArticleVersion (Id, Title WHERE id = 'ka0D0000000025eIAA')");
    });

    it('creates a query using the appropriate where condition', function() {
      expect(
        subject.find(['tourism']).
          returning(sObjects.KnowledgeArticleVersion, ['Id', 'Title']).
          where('Id').in(['ka0D0000000025eIAA', 'ka0D000000002HCIAY']).
          raw()
      ).toEqual("FIND {tourism} RETURNING KnowledgeArticleVersion (Id, Title WHERE id IN ('ka0D0000000025eIAA', 'ka0D000000002HCIAY'))");
    });

  });

  describe('.orderBy()', function() {

    it('create a query for finding and ordering a field', function() {
      expect(
        subject.find(['MyName']).
          returning(sObjects.Account, ['Name', 'Id']).orderBy('Id').
          raw()
      ).toEqual("FIND {MyName} RETURNING Account(Name, Id ORDER BY Id)");
    });

    it('create a query for finding and ordering by fields on multiple sobjects', function() {
      expect(
        subject.find(['MyContactName']).
          returning(sObjects.Contact, ['Name', 'Id']).orderBy('Name').
          returning(sObjects.Account, ['Description', 'Id']).orderBy('Description').
          raw()
      ).toEqual("FIND {MyContactName} RETURNING Contact(Name, Id ORDER BY Name), Account(Description, Id ORDER BY Description)");
    });

    it('create a query for finding and ordering a field', function() {
      expect(
        subject.find(['MyContactName']).inNameFields().
          returning(sObjects.Contact, ['Name', 'Id']).orderByDesc('Name').nullsLast().
          raw()
      ).toEqual("FIND {MyAccountName} IN NAME FIELDS RETURNING Account(Name, Id ORDER BY Name DESC NULLS last)");
    });

    it('create a query for finding and ordering a field', function() {
      expect(
        subject.find(['MyContactName']).inNameFields().
          returning(sObjects.Contact, ['Name', 'Id']).orderByAsc('Name').nullsFirst().
          raw()
      ).toEqual("FIND {MyAccountName} IN NAME FIELDS RETURNING Account(Name, Id ORDER BY Name ASC NULLS first)");
    });

  });

  describe('.with()', function() {

    it('adds a with division filter', function() {
      expect(
        subject.find(['test']).
          returning(sObjects.Account).withDivision('Global').
          raw()
      ).toEqual("FIND {test} RETURNING Account WITH DIVISION = 'Global'");
    });

  });

  describe('.withDataCategory()', function() {

  });

  describe('.limit()', function() {
    it('creates a correct query with a limit', function() {
      expect(
        subject.find(['test']).
          returning(sObjects.Account, ['Id']).limit(20).
          returning(sObjects.Contact).
          limit(100).
          raw()
      ).toEqual("FIND {test} RETURNING Account(id LIMIT 20), Contact LIMIT 100");
    });

    it('creates a correct query with a limit on the sobject, and query', function() {
      expect(
        subject.find(['test']).
          returning(sObjects.Account, ['id'], 20).
          returning(sObjects.Contact).
          returning(sObjects.Opportunity, ['id'], 75).
          limit(100).
          raw()
      ).toEqual("FIND {test} RETURNING Account(id LIMIT 20), Contact, Opportunity(id LIMIT 75) LIMIT 100")
    });

  });

  describe('.toLabel()', function() {

  });

});
