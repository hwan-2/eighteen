import './signup.css'

//회원가입 페이지
export default function Signup(){

    return(
        <div className={"register"}>
            <h1>회원가입</h1>
            <div className='form'>
                <form action='/signup' method='post'>
                    <div className='input'>
                        <label>이름</label>
                        <input type="text" name="name" minlength="2" required/>
                    </div>
                    <div className='input'>
                        <label>이메일</label>
                        <input type="email" name="email" placeholder="example@exam.com" required/>
                    </div>
                    <div className='input'>
                        <label>비밀번호</label>
                        <input type="password" name="password" placeholder="특수문자, 대문자 1개포함한 8~16자" required/>
                    </div>
                    <div>
                        <button type="submit">가입</button>
                    </div>
                </form>
            </div>
        </div>
    )
}