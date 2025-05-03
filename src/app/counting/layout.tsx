export default function MdxLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="prose prose-h1:prose-2xl p-6 max-w-3xl mx-auto">
            {children}
        </div>
    )
}
