const { ApolloServer } =  require('apollo-server')
const dns = require("dns")
//console.log(ApolloServer)

const typeDefs = `
  type Item {
    id: Int
    type: String
    description: String
  }

  type Domain {
    name: String
    extension: String
    checkout: String
    available: Boolean
  }

  type Query {
    items(type: String): [Item]
  }

  input ItemInput {
    type: String
    description: String
  }

  type Mutation {
    saveItem(item: ItemInput): Item
    deleteItem(id: Int): Boolean
    generateDomains: [Domain]
    generateDomain(name: String): [Domain]
  }
`
require('dotenv').config()
const knex = require('./config/db.js') // importing the db config

const itemsXXX = [
  {id: 1, type: 'prefix', description: "Air"},
  {id: 2, type: 'prefix', description: "Jet"},
  {id: 3, type: 'prefix', description: "Flight"},
  {id: 4, type: 'sufix', description: "Hub"},
  {id: 5, type: 'sufix', description: "Station"},
  {id: 6, type: 'sufix', description: "Mart"}
]


const isDomainAvailable = function(url) {
  return new Promise(function (resolve, reject) {
    dns.resolve(url, function(error) {
      if(error) { resolve (true) } //Dominio não registado
      else { resolve (false) } //Dominio já existe
    });
  });
};
 
const resolvers = {
  Query: {
    items(_, args) {
      console.log("getItems", args.type)
      //return items.filter(item => item.type === args.type);
      return knex('items').where('type', '=' , args.type);
    },
   },
   
   Mutation: {
    async saveItem(_, args) {
      /*
       const item = args.item // item > { type, description }
       item.id = Math.floor(Math.random()*1000)
       knex('items').push(item)
       return item;
 */
      try{
        // Existe description ?
        const newItem = args.item // item > { type, description }
        const found = await knex('items').where('description', "=", newItem.description).first()
        if(!found) { 
          newItem.id = Math.floor(Math.random()*1000)
          await knex('items').insert(newItem)
          return newItem
        }else{ return null }                 
      }
      catch(e){console.log('Error on saving...', e)}
     },

     async deleteItem(_, args) {
       /*
       const id = args.id
       const item = items.find(item => item.id === id) //find - devolve a posição do 1º que encontra
       if(!item) return false
       items.splice(items.indexOf(item), 1)
       return true
       */
      try{
        //const deleted = await knex('items').where('id', '=', args.id).delete()
        const deleted = await knex('items').where({id: args.id}).delete()
        console.log('Deletet item.', deleted)
        if(deleted) return true
        return false
      }
      catch(e){throw new error('Error on deleting..')}
      
     },

     async generateDomains() {
      console.log("generateDomains")
      const domains = [];
      const items = await knex('items')
      for(const prefix of items.filter(item => item.type === "prefix")) {
        for (const sufix of items.filter(item => item.type === "sufix")) {
          const name = prefix.description + sufix.description;
          const url = name.toLowerCase();
          const checkout = `https://checkout.hostgator.com.br/?a=add&sld=${url}&tld=.com.br`;
          const available = await isDomainAvailable(`${url}.com.br`)
          domains.push({
            name,
            checkout,
            available
          });
        }
      }
      return domains;
     },

     async generateDomain(_, args) {
       const name = args.name
       const domains = []
       const extensions = [".com.br", ".com", ".net", ".org"]
       for (const extension of extensions) {
        const url = name.toLowerCase();
        const checkout = `https://checkout.hostgator.com.br/?a=add&sld=${url}&tld=${extension}`;
        const available = await isDomainAvailable(`${url}${extension}`)
        domains.push({
          name,
          extension,
          checkout,
          available
        });
         
      }
       return domains;
     }
   }
  
}

const server = new ApolloServer({
  typeDefs, resolvers
})

const PORT = 4010;
server.listen (PORT, () => {
  console.log(`Your server on http://localhost:${PORT}`)
});
