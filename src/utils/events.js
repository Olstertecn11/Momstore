
// i want export in this file handleChange event for forms
export function handleChange(event, setFormData) {
  const { name, value } = event.target;
  setFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
}
