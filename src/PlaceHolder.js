import React from 'react';

const PlaceHolder = props => (
    <div
        style={{
            backgroundColor: '#ebebef',
            color: '#bbb',
            textAlign: 'center',
            height: '30px',
            lineHeight: '30px',
            width: '100%',
        }}
        {...props}
    >Item</div>
);

export default PlaceHolder