import { useForm, type FieldError } from "react-hook-form";
interface FormBuilderProps
{
    formSchema : any
}
type FormValues = Record<string, any>

export default function FormBuilder({ formSchema } : FormBuilderProps)
{
    const { register, handleSubmit, formState : { errors } } = useForm<FormValues>(
        {
            mode : "all"
        }
    )
    
    const onValid = (data : FormValues) => 
    {}

    const formFields : any = Object.values(formSchema.fields);
    
    return (
        <div>
            <h3>{ formSchema.meta.title }</h3>
            <p> { formSchema.meta.subtitle } </p>
            <form action="" method="post" id={formSchema.id}>
                {
                    formFields.map((field : any) => 
                    {
                        const fieldRules = field.rules ?? {}

                        return (
                        <div className="field-container">
                            { field.label && <label htmlFor={ field.id }> { field.label } </label> }

                            { field.renderer === "text" && <input type={ (field.inputType && field.inputType !== undefined) ? field.inputType : field.renderer } id={ field.id } placeholder={ field.placeholder } {...register(`${ field.id }`, fieldRules )} /> }
                            { field.renderer === "textarea" && <textarea id={ field.id } placeholder={ field.placeholder } {...register(`${ field.id }`, fieldRules )}></textarea> }
                            { field.renderer === "date" && <input type={ field.renderer } id={ field.id } {...register(`${ field.id }`, fieldRules )} /> }
                            { field.renderer === "number" && <input type={ field.renderer } id={ field.id } {...register(`${ field.id }`, fieldRules )} /> }
                            { field.renderer === "radio" && 
                                <div className="radio-btns-container">
                                    { field.props.options.map((option : any) => 
                                    (
                                        <div key={ option.value } className="radio-btn-container">
                                            <input type="radio" id={ option.value } value={ option.value } {...register(`${ field.id }`, fieldRules )} />
                                            <label htmlFor={ option.value }> { option.label } </label>
                                        </div>
                                    ))}
                                </div>
                            }
                            { field.renderer === "checkbox" && <input type="checkbox" name={ field.id } id={ field.id } /> }
                            { field.renderer === "select" && 
                                <select id={ field.id } {...register(`${ field.id }`, fieldRules )}>
                                    { field.placeholder && <option value=""> { field.placeholder } </option> }
                                    { field.props.data.map((opt : any, index : number) => 
                                    {
                                        const value = typeof opt === "object" ? opt.value ?? opt.label ?? opt.toString() : opt;
                                        const label = typeof opt === "object" ? opt.label ?? opt.value ?? opt.toString() : opt;
                                        return ( <option key={index} value={value}> {label} </option> );
                                    }
                                    ) }
                                </select>
                            }
                            { (errors[field.id] as FieldError | undefined)?.message && 
                                (
                                    <p className="form-errors">{ (errors[field.id] as FieldError)?.message }</p>
                                )
                            }

                        </div>
                        )
                    })
                }
                <div>
                    <button type="button">Clear</button>
                    <button type="button">Submit</button>
                </div>
            </form>
        </div>
    );
}