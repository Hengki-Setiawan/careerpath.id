export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Auth pages don't need the main navbar/footer
    return <>{children}</>
}
