/*
 * sObjectClass Specification
 * ============================================================================
 * author: Jack Galilee
 * ============================================================================
 */

describe('sObjectClass.js', function() {

  beforeEach(function() {
    subject = new sObjectClass(stubs.sObjects, stubs.schemaStub);
  });

  describe('._deferUnlessLoaded()', function() {

    describe('not loaded', function() {

      it('calls the load function if class is not loaded', function() {

      });

      it('calls the defered function after the load function', function() {
        
      });

    })

    describe('not loaded', function() {

      it('does not call the load function if the class is loaded', function() {

      });

      it('calls the defered function after the load function', function() {
        
      });

    });

  });

  describe('.url()', function() {
    
    it('returns the url as specified by the schema object', function() {
      expect(subject.url()).toEqual("http://sobject.class/");
    }); 

  });

  describe('.is()', function() {

    it('returns value for provided key in the private is object', function() {

    });
    
  });

  describe('.load()', function() {

    it('loads the fields for the sobject schema', function() {

    });

    it('marks the class as loaded', function() {

    });

    it('calls the ready function after loading the schema', function() {

    });

    it('returns itself', function() {

    });

  });

  describe('.className()', function() {
    
    it('returns the name of the provided schema object', function() {

    });

  });

  describe('.find()', function() {
    
    it('returns a SOQL builder', function() {

    });

    it('returns a SOQL builder with a SELECT added', function() {

    });

    it('returns a SOQL builder with a SELECT and FROM added', function() {

    });

  });

  describe('.build()', function() {
    
    describe('one set of attributes', function() {

      it('returns a new record', function() {

      });

      it('returns a new record with the provided attributes', function() {

      });

    });

    describe('multiple sets of attributes', function() {

      it('returns an array of the new records', function() {

      });

      it('creates a new record for each of the attribute sets', function() {

      });

    });

  });

  describe('.create()', function() {

    it('makes a request with the POST verb', function() {

    });

    it('makes a request to the class url', function() {

    });

    it('calls the after function with the data object', function() {

    });

    it('returns the provided record', function() {

    });

  });

  describe('.read()', function() {

    it('makes a request with the GET verb', function() {

    });

    it('makes a request to the records url', function() {

    });

    it('calls the after function with the data object', function() {

    });

    it('returns the provided record', function() {

    });

  });

  describe('.update()', function() {

    it('makes a request with the PATCH verb', function() {

    });

    it('makes a request to the records url', function() {

    });

    it('calls the after function with the data object', function() {

    });

    it('returns the provided record', function() {

    });

  });

  describe('.delete()', function() {

    it('makes a request with the DELETE verb', function() {

    });

    it('makes a request to the records url', function() {

    });

    it('calls the after function with the data object', function() {

    });

    it('returns the provided record', function() {

    });

  });

});
