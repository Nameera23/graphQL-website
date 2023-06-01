const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLEnumType, GraphQLScalarType } = require('graphql')
const project = require('../models/project')
const client = require('../models/client');

const clientType = new GraphQLObjectType({
    name: 'client',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString }
    })
});

const projectType = new GraphQLObjectType({
    name: 'project',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        client: {
            type: clientType,
            resolve(parent, args) {
                return client.findById(parent.clientId)
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {

        clients: {
            type: new GraphQLList(clientType),
            resolve(parent, args) {
                return client.find()
            }
        },
        client: {
            type: clientType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return client.findById(args.id)
            }
        },

        projects: {
            type: new GraphQLList(projectType),
            resolve(parent, args) {
                return project.find()
            }
        },
        project: {
            type: projectType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return project.findById(args.id)
            }
        }
    }
})

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addClient: {
            type: clientType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                phone: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                const clients = new client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone
                })
                return clients.save()
            }
        },
        deleteClient: {
            type: clientType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                return client.findByIdAndRemove(args.id)
            }
        },
        addProject: {
            type: projectType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
                status: {
                    type: new GraphQLEnumType({
                        name: "ProjectStatus",
                        values: {
                            "new": { value: 'not Started' },
                            "prog": { value: 'In progress' },
                            "comp": { value: 'completed' },
                        }

                    }),
                    defaultValue: 'not Started'
                },
                clientId: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                const projectx = new project({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId
                })
                return projectx.save()
            }
        },

        deleteProject: {
            type: projectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                return project.findByIdAndRemove(args.id)
            }
        },
        updateProject:{
            type: projectType,
            args:{
                id:{type: GraphQLNonNull(GraphQLID)},
                name: {type:GraphQLNonNull(GraphQLString)},
                description: {type:GraphQLNonNull(GraphQLString)},
                status:{type: new GraphQLScalarType({
                    name: "projectUpdate",
                    values: {
                        "new": { value: 'not Started' },
                        "prog": { value: 'In progress' },
                        "comp": { value: 'completed' },
                    }
                }),
                clientId: { type: GraphQLNonNull(GraphQLID) }
            }
            },
            resolve(parent,args){
                return project.findByIdAndUpdate(
                    args.id,
                    {
                        $set:{
                            name: args.name,
                            description: args.description,
                            status: args.status
                        }
                    },
                    {new: true}
                    )
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})