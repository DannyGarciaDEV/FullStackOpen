import { func } from 'prop-types';

describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset');
    const user = {
      name: 'danny',
      username: 'danny',
      password: 'danny',
    };
    cy.request('POST', 'http://localhost:3001/api/users/', user);
    const user2 = {
      name: 'wednesday',
      username: 'wednesday',
      password: 'wednesday',
    };
    cy.request('POST', 'http://localhost:3001/api/users/', user2);
    cy.visit('http://localhost:5173');
  });
  it('Login form is shown', function () {
    cy.contains('Login');
  });
  describe('Login', function () {
    it('user logs in successfully', function () {
      cy.get('input:first').type('danny');
      cy.get('input:last').type('danny');
      cy.contains('Login').click();
      cy.contains('Dear danny, Welcome!');
    });
    it('non-user login fails', function () {
      cy.get('input:first').type('danny');
      cy.get('input:last').type('wrong');
      cy.contains('Login').click();
      cy.contains('Wrong Credentials');
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)');
    });
  });
  describe('When logged in like works', function () {
    beforeEach(function () {
      cy.request('POST', 'http://localhost:3001/api/login', {
        username: 'danny',
        password: 'danny',
      }).then((response) => {
        localStorage.setItem('loggedinBlogUser', JSON.stringify(response.body));
      });
      cy.visit('http://localhost:5173');
    });

    it('A blog can be created', function () {
      cy.contains('Create new blog').click();
      cy.get('#title').type('new blog created with Cypress');
      cy.get('#author').type('Anonim');
      cy.get('#url').type('www.google.com');
      cy.get('#create-btn').click();
      cy.contains('new blog created with Cypress - author: Anonim');
      cy.get('div.success').should(
        'contain',
        'A new blog titled new blog created with Cypress by Anonim added'
      );
    });
    it('blog can be liked', function () {
      cy.createBlog({
        title: 'This blog post gets 1 like',
        author: 'Sunal',
        url: 'www.likelikelike.az',
      });
      cy.get('.visiblity-btn').click();
      cy.contains('likes 0');
      cy.get('.like-btn').click();
      cy.contains('likes 1');
    });
  });

  describe('When logged in only the post entry creator can delete it', function () {
    beforeEach(function () {
      cy.login({ username: 'danny', password: 'danny' });
      cy.createBlog({
        title: 'danny blog',
        author: 'danny',
        url: 'www.riza.az',
      });

      cy.login({ username: 'wednesday', password: 'wednesday' });
      cy.createBlog({
        title: 'wednesday blog',
        author: 'wednesday',
        url: 'www.wednesday.com.tr',
      });
    });

    it('removing blogs', function () {
      cy.contains('danny blog - author: Danny')
        .parent()
        .find('button')
        .should('contain', 'view')
        .click();
      cy.contains('danny blog - author: Danny')
        .parent()
        .parent()
        .find('button')
        .should('not.contain', 'delete');

      cy.contains('wednesday blog')
        .parent()
        .find('button')
        .should('contain', 'view')
        .click();
      cy.contains('wednesday blog')
        .parent()
        .find('button')
        .should('contain', 'Remove');
      cy.get('.remove-btn').click();
      cy.contains('wednesday blog - author: wednesday').should('not.exist');
    });

    it('blogs are in descending order by likes', function () {
      cy.get('.visiblity-btn').eq(1).click();
      cy.get('.like-btn').eq(0).click();
      cy.get('.visiblity-btn').eq(0).click();
      cy.contains('likes 0');
    });
  });
});