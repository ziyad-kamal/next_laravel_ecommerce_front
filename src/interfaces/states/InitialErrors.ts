interface InitialErrors {
    [key: string]: string[]; // Dynamic keys like "brands.0.name" with array of error messages
}

export default InitialErrors;
