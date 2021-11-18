'use strict';
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('comments', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userId: {
                type: Sequelize.INTEGER,
                foreignKey: true,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            messageId: {
                type: Sequelize.INTEGER,
                foreignKey: true,
                references: {
                    model: 'Messages',
                    key: 'id'
                }
            },
            comment: {
                allowNull: false,
                type: Sequelize.STRING
            },
            imageUrl: {
                allowNull: true,
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async(queryInterface, Sequelize) => {
        await queryInterface.dropTable('comments');
    }
};