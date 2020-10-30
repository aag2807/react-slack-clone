import React from 'react';
import{ Loader } from 'semantic-ui-react'

const Spinner = () => (
    <Loader active size='huge' content={'Preparing Chat...'}/>
)

export default Spinner;