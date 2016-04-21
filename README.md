Event abstract class
====================

ES6 abstract class to extend and allow classes to support native object event binding/triggering.

Example
-------
```javascript
import EventAbstractClass from 'event-abstract-class'

class Example extends EventAbstractClass {
    constructor () {
        super()
        
        this.value = null
    }
    
    setValue (value) {
        let oldValue = this.value
    
        this.trigger('setValue:pre', {
            newValue: value
        })
        
        this.value = value
        
        this.trigger('setValue:post', {
            newValue: value,
            oldValue: oldValue
        })
    }
}

let example = new Example()

example.on('setValue:post', (args) => {
    console.log('oldValue', args.oldValue)
    console.log('newValue', args.newValue)
})

example.setValue('New value 1!')
example.setValue('New value 2!')
```