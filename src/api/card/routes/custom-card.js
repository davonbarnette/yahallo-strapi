module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/cards/sync-cards',
      handler: 'card.syncCards',
    },
  ]
}
