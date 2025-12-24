package com.mall.controller;

import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // 允许前端跨域访问
public class AuthController {

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> user) {
        Map<String, Object> result = new HashMap<>();
        // 简化版逻辑：账号admin密码123即视为成功 
        if ("admin".equals(user.get("username")) && "123".equals(user.get("password"))) {
            result.put("code", 200);
            result.put("msg", "登录成功");
            result.put("token", "mock-jwt-token-for-demo"); // 计划书要求使用JWT 
        } else {
            result.put("code", 400);
            result.put("msg", "用户名或密码错误");
        }
        return result;
    }
}