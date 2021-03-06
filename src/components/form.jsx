import { Component } from 'react'
import Input from './input'
import Joi from "joi-browser";

class Form extends Component {
    state = { 
        data: {},
        errors: {}
    }  

    validate = () => {
        const option = {abortEarly: false}
        const { error } = Joi.validate(this.state.data, this.schema, option);
        if(!error) return null

        const errors = {}
        for(let item of error.details) errors[item.path[0]] = item.message;
        return errors;
    };

    validateProperty = ({ name, value }) => {
        const obj = { [name]: value};
        const schema = { [name]: this.schema[name] };
        const { error } = Joi.validate(obj, schema);
        return error ? error.details[0].message : null;
    };

    handleSubmit = e => {
        e.preventDefault();
        const errors = this.validate();
        this.setState({ errors: errors || {}});
        if(errors) return;

        this.doSubmit();
    }

    handleChange = ({ currentTarget: input }) => {
        const errors = {...this.state.errors};
        const errorMessage = this.validateProperty(input);
        if(errorMessage) errors[input.name] = errorMessage;
        else delete errors[input.name];

        const data = { ...this.state.data };
        data[input.name] = input.value;
        this.setState({
            data,
            errors
        })
    }

    renderButton(name) {
        return <button disabled={this.validate()} className="btn btn-primary">{name}</button>
    }

    renderInput(name, label, type='text') {
        return (<Input 
        name={name}
        type={type}
        value={this.state.data[name]} 
        onChange={this.handleChange} 
        label={label}
        errors={this.state.errors[name]} />);
    }
}
 
export default Form;