import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  error?: string
  success?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  touched?: boolean
  showValidIcon?: boolean
  showErrorIcon?: boolean
}

const FormFieldContext = React.createContext<{
  error?: string
  success?: string
  touched?: boolean
}>({})

const FormField = React.forwardRef<
  HTMLDivElement,
  FormFieldProps
>(
  (
    {
      className,
      label,
      error,
      success,
      helperText,
      required,
      disabled,
      touched,
      showValidIcon = true,
      showErrorIcon = true,
      children,
      ...props
    },
    ref
  ) => {
    const hasError = touched && error
    const hasSuccess = touched && success && !error

    return (
      <FormFieldContext.Provider
        value={{
          error: hasError ? error : undefined,
          success: hasSuccess ? success : undefined,
          touched,
        }}
      >
        <div
          ref={ref}
          className={cn("w-full space-y-2", disabled && "opacity-50", className)}
          {...props}
        >
          {label && (
            <Label
              className={cn(
                "flex items-center gap-2",
                disabled && "opacity-60",
                hasError && "text-red-600 dark:text-red-400"
              )}
            >
              {label}
              {required && <span className="text-red-600">*</span>}
            </Label>
          )}

          <div className="relative">
            {children}

            {/* Success Icon */}
            {hasSuccess && showValidIcon && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            )}

            {/* Error Icon */}
            {hasError && showErrorIcon && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            )}
          </div>

          {/* Error Message */}
          {hasError && (
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {error}
            </p>
          )}

          {/* Success Message */}
          {hasSuccess && (
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              {success}
            </p>
          )}

          {/* Helper Text */}
          {helperText && !hasError && !hasSuccess && (
            <p className="text-xs text-muted-foreground">{helperText}</p>
          )}
        </div>
      </FormFieldContext.Provider>
    )
  }
)
FormField.displayName = "FormField"

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  success?: string
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, error, success, ...props }, ref) => {
    const context = React.useContext(FormFieldContext)
    const hasError = context.touched && (error || context.error)
    const hasSuccess = context.touched && (success || context.success) && !hasError

    return (
      <Input
        ref={ref}
        className={cn(
          "pr-10",
          hasError &&
            "border-red-600 focus-visible:ring-red-600 dark:border-red-400 dark:focus-visible:ring-red-400",
          hasSuccess &&
            "border-green-600 focus-visible:ring-green-600 dark:border-green-400 dark:focus-visible:ring-green-400",
          className
        )}
        {...props}
      />
    )
  }
)
FormInput.displayName = "FormInput"

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  success?: string
}

const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ className, error, success, ...props }, ref) => {
    const context = React.useContext(FormFieldContext)
    const hasError = context.touched && (error || context.error)
    const hasSuccess = context.touched && (success || context.success) && !hasError

    return (
      <Textarea
        ref={ref}
        className={cn(
          hasError &&
            "border-red-600 focus-visible:ring-red-600 dark:border-red-400 dark:focus-visible:ring-red-400",
          hasSuccess &&
            "border-green-600 focus-visible:ring-green-600 dark:border-green-400 dark:focus-visible:ring-green-400",
          className
        )}
        {...props}
      />
    )
  }
)
FormTextarea.displayName = "FormTextarea"

export { FormField, FormInput, FormTextarea }
