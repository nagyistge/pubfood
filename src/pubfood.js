/**
 * pubfood
 * Copyright (c) 2015 Yieldbot, Inc. - All rights reserved.
 *
 * Pubfood - A browser client header bidding JavaScript library.
 */

'use strict';

var Event = require('./event');
var version = require('../package.json').version;
var util = require('./util');
var logger = require('./logger');

(function(global, undefined, ctor) {

  if (global) {
    module.exports = ctor(global, global.pfConfig || {});
  }

}(window || {}, undefined, function(global/*, config*/) {

  var pubfood = function(optionalId) {
    return new pubfood.library.init(optionalId);
  };

  pubfood.library = pubfood.prototype = {
    version: version,
    model: require('./model'),
    provider: require('./provider'),
    util: util,
    mediator: require('./mediator').mediatorBuilder(),
    interfaces: require('./interfaces'),
    PubfoodError: require('./errors'),
    logger: logger
  };

  /**
   * Creates a new Pubfood Bidding instance
   *
   * @alias pubfood
   * @constructor
   * @param {string} [optional_id] Optional ID
   * @return {pubfood}
   */
  var api = pubfood.library.init = function(optionalId) {
    logger.logCall('api.init', arguments);
    this.EVENT_TYPE = Event.EVENT_TYPE;
    this.logger = logger;
    this.id = optionalId;
    return this;
  };

  /**
   * Make this adslot avaialble for bidding
   *
   * @function
   * @param {SlotConfig} slot Slot configuration
   * @return {pubfood}
   */
  api.prototype.addSlot = function(slot) {
    logger.logCall('api.addSlot', arguments);
    this.library.mediator.addSlot(slot);
    return this;
  };

  /**
   * Get a list a of all registered slots
   * @return {MediatorSlot}
   */
  api.prototype.getSlots = function() {
    logger.logCall('api.getSlots', arguments);
    return this.library.mediator.slots;
  };

  /**
   * Set the Auction Provider
   *
   * @function
   * @param {AuctionDelegate} delegate Auction provider configuration
   * @throws {PubfoodError}
   * @return {pubfood}
   */
  api.prototype.setAuctionProvider = function(provider) {
    logger.logCall('api.setAuctionProvider', arguments);
    this.library.mediator.setAuctionProvider(provider);
    return this;
  };

  api.prototype.getAuctionProvider = function() {
    logger.logCall('api.getAuctionProvider', arguments);
    return this.library.mediator.auctionProvider;
  };

  /**
   * Add a BidProvider
   *
   * @function
   * @param {BidDelegate} delegate Bid provider configuaration
   * @throws {PubfoodError}
   * @return {pubfood}
   * @example {file} ../examples/add-bid-provider.js
   */
  api.prototype.addBidProvider = function(delegate) {
    logger.logCall('api.addBidProvider', arguments);
    this.library.mediator.addBidProvider(delegate);
    return this;
  };

  /**
   * Gets a list of bidproviders
   * @return {BidProvider[]}
   */
  api.prototype.getBidProviders = function() {
    logger.logCall('api.getBidProvider', arguments);
    return this.library.mediator.bidProviders;
  };

  /**
   * Add a custom reporter
   * @param {string} [eventType] the event to bind this reporter to
   * @param {Reporter} reporter Custom reporter
   * @return {pubfood}
   * @example {file} ../examples/reporter.js
   */
  api.prototype.addReporter = function(eventType, reporter) {
    logger.logCall('api.addReporter', arguments);
    if (typeof eventType === 'function') {
      reporter = eventType;
      eventType = '';
    }

    if (Event.EVENT_TYPE[eventType]) {
      Event.on(Event.EVENT_TYPE[eventType], util.bind(reporter, this));
    } else {
      // subscribe the reported to all the available events
      for (var e in Event.EVENT_TYPE) {
        Event.on(Event.EVENT_TYPE[e], util.bind(reporter, this));
      }
    }
    return this;
  };

  /**
   * Start the bidding process
   *
   * @return {pubfood}
   */
  api.prototype.start = function() {
    logger.logCall('api.start', arguments);
    this.library.mediator.start();
    return this;
  };

  /**
   * Refresh slot bids.
   *
   * @param {string[]} [slotNames] Optional list of slot names to refresh.
   * @return {pubfood}
   */
  api.prototype.refresh = function(slotNames) {
    logger.logCall('api.refresh', arguments);
    this.library.mediator.refresh(slotNames);
    return this;
  };

  api.prototype.library = pubfood.library;

  global.pubfood = pubfood;
  return pubfood;
}));
