export default function Page({ params }: { params: { id: string }}) {
    return (
        <div>Params: {params.id}</div>
    )
}