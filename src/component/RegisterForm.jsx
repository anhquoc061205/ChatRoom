import { Button, Form, Input } from "antd";
import Password from "antd/es/input/Password";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";
import { toast } from "react-toastify";

function RegisterForm() {
  const navigate = useNavigate();
  const handleSubmit = async (value) => {
    console.log(value);
    
    try {
      const response = await supabase
        .from("users")
        .insert({ username: value.username, password: value.password })
        .select();
      console.log(response);
      if(response.error){
        if (response.error.code == "23505") {
        toast.error("Đăng ký đã tồn tại");
      }
      
      } if(response.data){
        toast.success("Đăng ký thành công");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Đăng ký thất bại");
    }
  };
  return (
    <div className="w-[300px] h-[55vh] bg-[white] rounded-2xl p-[20px]">
      <h3 className="text-[24px] font-bold mb-[15px] text-black">Đăng Ký </h3>
      <Form labelCol={{ span: 24 }} onFinish={handleSubmit}>
        <Form.Item
          label="Username:"
          name="username"
          rules={[
            { required: true, message: "làm ơn nhập username" },
            { min: 6, message: "username phải có ít nhất 6 kí tự" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password:"
          name="password"
          rules={[
            { required: true, message: "làm ơn nhập password" },
            { min: 6, message: "password phải có ít nhất 6 kí tự" },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="ConfirmPassword:"
          name="ConfirmPassword"
          rules={[
            { required: true, message: "làm ơn nhập password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value)
                  return Promise.resolve();
                else {
                  return Promise.reject(
                    new Error("confirm password không khớp")
                  );
                }
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            className="w-full"
            color="default"
            variant="solid"
          >
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
      <p className="text-black text-center">
        bạn đã có tài khoản ?{" "}
        <Link to={"/Login"} className="font-[600] text-black">
          Đăng Nhập
        </Link>
      </p>
    </div>
  );
}

export default RegisterForm;
