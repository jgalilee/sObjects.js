describe('soql.js', function() {

  subject = new SOQL();

  describe('.select([0..n])', function() {

    it('creates a select query with no columns', function() {
      expect(subject.
        select([]).
        finish()).
      toEqual('SELECT');
    });

    it('creates a select query with one column, without a seperator', function() {
      expect(subject.
        select(['Name']).
        finish()).
      toEqual('SELECT Name');
    });

    it('creates a select query with two columns, with a comma seperator', function() {
      expect(subject.
        select(['Id', 'Name']).
        finish()).
      toEqual('SELECT Id, Name');
    });

    it('creates a query with a single sub query', function() {
      expect(subject.
        select(['Id', 'Name']).subSelect(function(queryBuilder) {
          queryBuilder.select(['PostCode']);
          return queryBuilder;
        }).
        finish()).
      toEqual('SELECT Id, Name ( SELECT PostCode )');
    });

    it('creates a query with multiple sub queries', function() {
      expect(subject.
        select(['Id', 'Name']).subSelect(function(q1) {
          return q1.select(['PostCode']).subSelect(function(q2) {
            return q2.select(['City', 'State', 'Country']);
          })
        }).
        finish()).
      toEqual('SELECT Id, Name ( SELECT PostCode ( SELECT City, State, Country ) )');
    });

  });

  describe('.from(name)', function() {

    it('creates a select query taken from a specified table', function() {
      expect(subject.
        select(['Id', 'Name']).
        from('Contact').
        finish()).
      toEqual('SELECT Id, Name FROM Contact');
    });

  });

  describe('.where(field)', function() {

    describe('.equals(value)', function() {

      it('creates a select query taken from a specified table, with a single condition on a column', function() {
        expect(subject.
          select(['Id', 'FirstName', 'LastName']).
          from('Contact').
          where('FirstName').equal('Joe').
          finish()).
        toEqual('SELECT Id, FirstName, LastName FROM Contact WHERE FirstName == Joe');
      });

      describe('.and(value)', function() {

        it('creates a select query taken from a specified table, with multiple conditions on multiple columns', function() {
          expect(subject.
            select(['Id', 'FirstName', 'LastName']).
            from('Contact').
            where('FirstName').equal('Joe').
            and('LastName').equal('Bloggs').
            finish()).
          toEqual('SELECT Id, FirstName, LastName FROM Contact WHERE FirstName == Joe AND LastName == Bloggs');
        });

      });

      describe('.or(value)', function() {

        it('creates a select query taken from a specified table, with multiple conditions on multiple columns', function() {
          expect(subject.
            select(['Id', 'FirstName', 'LastName']).
            from('Contact').
            where('FirstName').equal('Joe').
            or('LastName').equal('Bloggs').
            finish()).
          toEqual('SELECT Id, FirstName, LastName FROM Contact WHERE FirstName == Joe OR LastName == Bloggs');
        });

      });

    });

    describe('.notEqual(value)', function() {

      it('creates a select query taken from a specified table, with a single condition on a column', function() {
        expect(subject.
          select(['Id', 'FirstName', 'LastName']).
          from('Contact').
          where('FirstName').notEqual('Joe').
          finish()).
        toEqual('SELECT Id, FirstName, LastName FROM Contact WHERE FirstName != Joe');
      });

      describe('.and(value)', function() {

        it('creates a select query taken from a specified table, with multiple conditions on multiple columns', function() {
          expect(subject.
            select(['Id', 'FirstName', 'LastName']).
            from('Contact').
            where('FirstName').notEqual('Joe').
            and('LastName').equal('Bloggs').
            finish()).
          toEqual('SELECT Id, FirstName, LastName FROM Contact WHERE FirstName != Joe AND LastName == Bloggs');
        });

      });

      describe('.or(value)', function() {

        it('creates a select query taken from a specified table, with multiple conditions on multiple columns', function() {
          expect(subject.
            select(['Id', 'FirstName', 'LastName']).
            from('Contact').
            where('FirstName').notEqual('Joe').
            or('LastName').equal('Bloggs').
            finish()).
          toEqual('SELECT Id, FirstName, LastName FROM Contact WHERE FirstName != Joe OR LastName == Bloggs');
        });

      });

    });

    describe('.isNull()', function() {

      it('creates a select query taken from a specified table, with a single condition on a column', function() {
        expect(subject.
          select(['Id', 'FirstName', 'LastName']).
          from('Contact').
          where('FirstName').isNull().
          finish()).
        toEqual('SELECT Id, FirstName, LastName FROM Contact WHERE FirstName IS NULL');
      });

    });

    describe('.isNotNull()', function() {

      it('creates a select query taken from a specified table, with a single condition on a column', function() {
        expect(subject.
          select(['Id', 'FirstName', 'LastName']).
          from('Contact').
          where('FirstName').isNotNull().
          finish()).
        toEqual('SELECT Id, FirstName, LastName FROM Contact WHERE FirstName IS NOT NULL');
      });

    });

    describe('.in([0..n])', function() {

      it('creates a select query taken from a specified table, with a single condition on a column', function() {
        expect(subject.
          select(['Id', 'FirstName', 'LastName']).
          from('Contact').
          where('FirstName').in(['Joe', 'John']).
          finish()).
        toEqual('SELECT Id, FirstName, LastName FROM Contact WHERE FirstName IN( Joe, John )');
      });

    });

    describe('.limit(n)', function() {

      it('creates a select query taken from a specified table, with a single condition on a column', function() {
        expect(subject.
          select(['Id', 'FirstName', 'LastName']).
          from('Contact').
          where('FirstName').in(['Joe', 'John']).
          limit(10).
          finish()).
        toEqual('SELECT Id, FirstName, LastName FROM Contact WHERE FirstName IN( Joe, John ) LIMIT 10');
      });

    });

    describe('.orderBy([0..n])', function() {

      it('creates a select query taken from a specified table, with a single condition on a column', function() {
        expect(subject.
          select(['Id', 'FirstName', 'LastName']).
          from('Contact').
          where('FirstName').in(['Joe', 'John']).
          orderBy(['FirstName', 'LastName']).
          limit(10).
          finish()).
        toEqual('SELECT Id, FirstName, LastName FROM Contact WHERE FirstName IN( Joe, John ) ORDER BY FirstName, LastName LIMIT 10');
      });

      describe('.orderByAsc([0..n])', function() {

        it('creates a select query taken from a specified table, with a single condition on a column', function() {
          expect(subject.
            select(['Id', 'FirstName', 'LastName']).
            from('Contact').
            where('FirstName').in(['Joe', 'John']).
            orderByAsc(['FirstName', 'LastName']).
            limit(10).
            finish()).
          toEqual('SELECT Id, FirstName, LastName FROM Contact WHERE FirstName IN( Joe, John ) ORDER BY ASC FirstName, LastName LIMIT 10');
        });

      });

      describe('.orderByDesc([0..n])', function() {

        it('creates a select query taken from a specified table, with a single condition on a column', function() {
          expect(subject.
            select(['Id', 'FirstName', 'LastName']).
            from('Contact').
            where('FirstName').in(['Joe', 'John']).
            orderByDesc(['FirstName', 'LastName']).
            limit(10).
            finish()).
          toEqual('SELECT Id, FirstName, LastName FROM Contact WHERE FirstName IN( Joe, John ) ORDER BY DESC FirstName, LastName LIMIT 10');
        });

      });

    });

  });

});
