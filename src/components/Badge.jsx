import { createClassName } from "../utils/utils"

const Badge = ({ className, children, variant = 'default', size = 'lg', color = 'grey', ...props }) => {

    const sizeClassName = {
        lg: "text-body-m h-[32px] rounded-8 px-[6px] py-8",
        md: "text-body-s h-[24px] rounded-4 px-4 py-8",
        sm: "text-body-s h-[16px] rounded-4 py-[6px]"
    }

    const colorClassName = {
        grey: "bg-neutral-200 text-neutral-700 fill:bg-neutral-0 fill:border-neutral-200",
        green: "bg-success-100 text-success-700",
        red: "bg-error-100 text-error-700",
        yellow: 'bg-warning-100 text-warning-700'
    }

    const variantClassName = {
        default: "max-w-fit capitalize gap-8 flex items-center justify-center font-body font-normal fill:border"
    }

    return (
        <div className={ createClassName(sizeClassName[size], colorClassName[color], variantClassName[variant], className) } { ...props }>
            { children }
        </div>
    )
}

export default Badge;
