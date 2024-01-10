// Import React and useState hook
import React, { useState } from 'react';

const Counter = () => {
    // Initialize counter state
    const [counter, setCounter] = useState(0);

    // Function to increment counter
    const incrementCounter = () => {
        setCounter(counter + 1);
    };

    return (
        <div>
            <h1>Counter: {counter}</h1>
            <button onClick={incrementCounter}>Increment</button>
        </div>
    );
};

export default Counter;