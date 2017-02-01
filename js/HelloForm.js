var HelloSayer = require('./HelloSayer');
var React = require('react');

var HelloForm = React.createClass({
    getInitialState: function() {
        return {
            name: 'world'
        };
    },

    render: function() {
        return (<div className="hello-form">
            <input type="text" onChange={this.onChange} />
            <HelloSayer name={this.state.name} />
        </div>);
    },

    onChange: function(e) {
        this.setState({
            name: e.target.value
        });
    }
});

module.exports = HelloForm;
