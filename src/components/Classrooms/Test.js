export default function Test ({userInfo}) {
    return (
        <div>
        {Object.keys(userInfo).length ? userInfo.classrooms.map((classroom) => {
            return(
                <div>
                    <p>classroom.classroomInfo.name = {classroom.classroomInfo.name}</p>
                </div>
            )
        }) : null}
        </div>
    )
}