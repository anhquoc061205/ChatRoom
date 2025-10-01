import { Button, Form, Input } from "antd";
import Password from "antd/es/input/Password";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";
import { toast } from "react-toastify";

function LoginForm() {
  const navigate = useNavigate();
  const handleSubmit = async (value) => {
    console.log(value);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, username")
        .eq("username", value.username)
        .eq("password", value.password)
        .single();
      if(error){
         if (error.code === "PGRST116") {
        toast.error("Đăng nhập hoặc mật khẩu không đúng");
      }
      }
     
      if (data) {
        console.log(data);
        toast.success("Đăng nhập thành công");
        localStorage.setItem("id", data.id);
        localStorage.setItem("username", data.username);
        navigate("/");
      }
    } catch (error) {
      toast.error("Đăng nhập thất bại");
    }
  };
  return (
    <div className="w-[300px] h-[40vh] bg-[white] rounded-2xl p-[20px]">
      <h3 className="text-[24px] font-bold mb-[15px] text-black">Đăng Nhập </h3>
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
        <Form.Item>
          <Button
            htmlType="submit"
            className="w-full"
            color="default"
            variant="solid"
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
      <p className="text-black text-center">
        bạn chưa có tài khoản ?{" "}
        <Link to={"/register"} className="font-[600] text-black">
          Đăng ký
        </Link>
      </p>
    </div>
  );
}

export default LoginForm;
