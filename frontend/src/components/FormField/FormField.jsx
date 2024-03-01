import "./FormField.scss";

const FormField = (props) => {
  const { type, placeholder, setFunc , value } = props;

  return (
    <input
      type={type}
      className="form-control"
      id={`${type}Input`}
      name={`${type}Input`}
      placeholder={placeholder}
      onChange={(event) => setFunc(event.target.value)}
      value={value}
    />
  );
};

export default FormField;
