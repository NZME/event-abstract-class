/**
 * Event abstract class
 *
 * Extend to allow classes to support native object event triggering/binding
 */
export default class EventAbstractClass {
    // region Constructor

    /**
     * Constructor
     */
    constructor () {
        this.events = {}
    }

    // endregion Constructor

    // region Helpers

    /**
     * Split events list string into array
     *
     * @param {String} events String of events to split
     * @returns {Array}
     */
    getEventList (events){
        return events.trim().split(/(?:,|\s)+/g);
    }

    /**
     * Get namespaces from event name string
     *
     * @param {String} event Event name string
     * @returns {Array}
     */
    getNamespaces (event) {
        let namespaces = [],
            splitEvent = event.trim().split(/:+/g)

        for (let i = splitEvent.length; i >= 1; i -= 1) {
            namespaces.push(splitEvent.slice(0, i).join(':'))
        }

        return namespaces
    }

    // endregion Helpers

    // region Controls

    /**
     * Trigger event
     *
     * @param {String} eventName Name of event to trigger
     * @param {*}      data      Data to pass to event handler
     */
    trigger (eventName, data = null) {
        let events = this.getEventList(eventName)

        for (let event of events) {
            let namespaces = this.getNamespaces(event)

            for (let namespace of namespaces) {
                if (!this.events[namespace]) {
                    continue
                }

                for (let handler of this.events[namespace]) {
                    handler.call(this, data)
                }
            }
        }
    }

    /**
     * Bind handler to event
     *
     * @param {String}   eventName Name of event to bind to
     * @param {Function} handler   Event handler function to bind
     */
    on (eventName, handler) {
        let events = this.getEventList(eventName);

        for (let event of events){
            if (!this.events[event]) {
                this.events[event] = []
            }

            this.events[event].push(handler)
        }
    }

    /**
     * Unbind handler from event
     *
     * @param {String}   eventName Name of event to unbind from
     * @param {Function} handler   Event handler function to unbind
     */
    off (eventName, handler) {
        let events = this.getEventList(eventName)

        for (let event of events) {
            if (!this.events[event]) {
                return
            }

            let index = this.events[event].indexOf(handler)

            if (index >= 0) {
                this.events[event].splice(index, 1)
            }
        }
    }

    /**
     * Bind handler to event to run once
     *
     * @param {String}   eventName Name of event to bind to
     * @param {Function} handler   Event handler function to bind
     */
    once (eventName, handler) {
        function handleOffRemove () {
            this.off(eventName, handler)
            this.off(eventName, handleOffRemove)
        }

        this.on(eventName, handler)
        this.on(eventName, handleOffRemove)
    }

    // endregion Controls
}