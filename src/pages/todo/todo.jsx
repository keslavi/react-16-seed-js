import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import './style.css'
import {
    actTodo_C,
    actTodo_R,
    actTodo_U,
    actTodo_D,
    actTodoClearSelected,
} from '../../store';

import {
    Button,
    Col,
    Row,
    Form,
    Input,
    Label,
} from 'reactstrap';

import { TextareaDebug } from '../../components';

// *************************************************************************
// validation handling
// for real app we'll probably abstract the validation to a central point

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import { toast } from "react-toastify";

const schema = yup.object().shape({
    id: yup.string().required("id is required"),
    subject: yup.string().required("Please provide a subject"),
    body: yup.string().required("please provide the message body"),
    // ...AddressSchema // Custom schema imported from address inputs.
});

const errorNotification = (errors) => {
    let i = 0;
    const messages = Object.keys(errors).map((e) => (
        <span key={++i}>
            {errors[e].message}
            <br />
        </span>
    ));

    if (!_.isEmpty(messages)) {
        //console.log (msg);
        toast.dismiss();
        toast.warn(<div>{messages}</div>, { autoClose: false });
    }
};

// /validation handling
// ***********************************************************************


export const Todo = (props) => {
    const {
        idItem,     //from mapStateToProps via url
        item,       //from mapStateToProps
        options,    //from mapStateToProps for dropdowns
        history,    //to change to the Retrieve Page
        actTodo_C,
        actTodo_R,
        actTodo_U,
        actTodo_D,
        actTodoClearSelected,
    } = props;


    useEffect(() => {
        actTodo_R(idItem);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //form validation
    const { register, handleSubmit, watch, errors } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = (values) => {
        actTodo_U(values)
        // sample debugging; intermediate step before saving data
        // console.log("onSubmit fired");
        // console.log("submit:", JSON.stringify(values, null, 2));
    };

    if (_.isEmpty(item) | _.isEmpty(options)) {
        return (
            <div id="noItem">
                ...
                {/* needed  because the signature has to match properties in FC */}
                <form onSubmit={handleSubmit(onSubmit)}></form>
            </div>
        );
    }

    errorNotification(errors);

    return (
        <div id="hasItem">
            (note: doing bare minimum styling with bootstrap for clarity)
            <br/>strongly recommend abstracting the label/input into a child component
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col xs="1">
                        <Label>ID</Label>
                    </Col>
                    <Col xs="3">
                        <Input
                            type="input"
                            name="id"
                            defaultValue={item.id}
                            innerRef={register()}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col xs="1">
                        <Label>Subject </Label>
                    </Col>
                    <Col xs="3">
                        <Input
                            type="input"
                            name="subject"
                            defaultValue={item.subject}
                            innerRef={register()}
                        />
                        {/* <ErrorMessage name="subject" component="div" /> */}
                    </Col>
                </Row>
                <Row>
                    <Col xs="1">
                        <Label>Body </Label>
                    </Col>
                    <Col xs="3">
                        <Input
                            type="input"
                            name="body"
                            defaultValue={item.body}
                            innerRef={register()}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col xs="1">
                        <Label>Status </Label>
                    </Col>
                    <Col xs="3">
                        {/* imo better to abstract this to child component; see redux-form-helpers.js for Formik example 
                  formik example usage: {this.dropdown("result")}
              */}
                        <Input
                            type="select"
                            name="status"
                            defaultValue={item.status}
                            innerRef={register()}
                        >
                            {options.status.map((o) => {
                                return (
                                    <option key={`status${o.value}`} value={o.value}>
                                        {o.text}
                                    </option>
                                );
                            })}
                        </Input>
                    </Col>
                </Row>
                <Row>
                    <Col xs="1">
                        <Label>Result</Label>
                    </Col>
                    <Col xs="3">
                        <Input
                            type="select"
                            name="result"
                            defaultValue={item.result}
                            innerRef={register()}
                        >
                            {options.result.map((o) => {
                                return (
                                    <option key={`result${o.value}`} value={o.value}>
                                        {o.text}
                                    </option>
                                );
                            })}
                        </Input>
                    </Col>
                </Row>
                <Row>
                    <Col xs="1"></Col>
                    <Col xs="3">
                        <Button type="submit" name="submit" color="primary">
                            Submit
                        </Button>
                    </Col>
                </Row>
            </Form>
            <TextareaDebug value={{ errors, item, options }} />
        </div>
    );
}


const mapStateToProps = (state, ownProps) => {
    return {
        idItem: ownProps.match.params.id,
        item: state.todo,
        options: state.options?.todo,
    }
}

export default connect(mapStateToProps, {
    actTodo_C,
    actTodo_R,
    actTodo_U,
    actTodo_D,
    actTodoClearSelected,
})(withRouter(Todo));
//understanding connect is very import, it cleans up code considerably
//and does away with manual dispatches... actions are wrapped in dispatch automatically



// ********************************************************************
// const render = (item, options, history) => {
//     console.log('TODO:', item);
//     return (
//         <div id='hasItem'>
//             has items
//             <TextareaDebug value={{ item, options }} />

//         </div>
//     )
// }