describe('Blog App', function() {
  beforeEach(function() {
    cy.request('POST',`${Cypress.env('BACKEND')}/api/testing/reset`)
    const user = {
      username: 'testuser',
      password: 'testpassword',
      name: 'Test User'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/api/users`, user)
    cy.visit('')
  })

  it('Front page can be opened', function() {
    cy.contains('Blogs')
    cy.contains('Blog app, 2023')
  })

  it('Login form can be opened', function() {
    cy.contains('Login').click()
    cy.get('#username').type('testuser')
    cy.get('#password').type('testpassword')
    cy.get('#login-button').click()

    cy.contains('Dear Test User, Welcome!')
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'testuser', password: 'testpassword' })
    })

    it('A new blog can be created', function() {
      cy.contains('Create new blog').click()
      cy.get('#title').type('New Blog Title')
      cy.get('#author').type('New Blog Author')
      cy.get('#url').type('http://example.com')
      cy.get('#create-btn').click()
      cy.contains('New Blog Title - author: New Blog Author')
    })

    describe('And a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({ title: 'First Blog', author: 'Test Author', url: 'http://example.com' })
        cy.createBlog({ title: 'Second Blog', author: 'Test Author', url: 'http://example.com' })
        cy.createBlog({ title: 'Third Blog', author: 'Test Author', url: 'http://example.com' })
      })

      it('One of those blogs can be liked', function () {
        cy.contains('Second Blog').parent().find('.visiblity-btn').click()
        cy.contains('likes 0')
        cy.get('.like-btn').click()
        cy.contains('likes 1')
      })
    })
  })

  it('Login fails with wrong credentials', function() {
    cy.contains('Login').click()
    cy.get('#username').type('testuser')
    cy.get('#password').type('wrongpassword')
    cy.get('#login-button').click()

    cy.get('.error')
      .should('contain', 'Wrong Credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
  })
})
