package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.User;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.Mail;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;


@WebServlet(name = "SignUp", urlPatterns = {"/SignUp"})
public class SignUp extends HttpServlet {

    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        System.out.println("OK");
        
        Gson gson = new Gson();
        JsonObject user = gson.fromJson(request.getReader(), JsonObject.class);

        String firstName = user.get("firstName").getAsString();
        String lastName = user.get("lastName").getAsString();
        final String email = user.get("email").getAsString();
        String password = user.get("password").getAsString();
//        boolean terms = user.get("terms").getAsBoolean();
        
        System.out.println(firstName);
        System.out.println(lastName);
        System.out.println(email);
        System.out.println(password);
        
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);
        
        if (firstName.isEmpty()) {
            responseObject.addProperty("message", "FirstName can not be empty!");
        } else if (lastName.isEmpty()) {
            responseObject.addProperty("message", "Last name can not be empty!");
        } else if (email.isEmpty()) {
            responseObject.addProperty("message", "email can not be empty!");
        } else if (!Util.isEmailValid(email)) {
            responseObject.addProperty("message", "Please enter a valid email!");
        } else if (password.isEmpty()) {
            responseObject.addProperty("message", "Password can not be empty!");
        } else if (!Util.isPasswordValid(password)) {
            responseObject.addProperty("message", "The password must contains at least uppercase, lowecase, number, special character and be minimum eight characters long!");
        } else { 
        
            //hibernate save
            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session s = sf.openSession();

            Criteria criteria = s.createCriteria(User.class);
            criteria.add(Restrictions.eq("email", email));

            if (!criteria.list().isEmpty()) {
                responseObject.addProperty("message", "User with this email already exists");
            } else {

                User u1 = new User();
                u1.setFirst_name(firstName);
                u1.setLast_name(lastName);
                u1.setEmail(email);
                u1.setPassword(password);

                //generate verification code
                final String verificationCode = Util.generateCode();
                u1.setVerification(verificationCode);
                //generate verification code

                u1.setCreated_at(new Date());

                s.save(u1);
                s.beginTransaction().commit();
                //hibernate save

                //send email
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        Mail.sendMail(email, "Book Bazaar - Verification", "<h1>" + verificationCode + "</h1>");
                    }
                }).start();
                //send email
                
                //session management
                HttpSession ses = request.getSession();
                ses.setAttribute("email",email);
                //session management
           
                responseObject.addProperty("status", true);
                responseObject.addProperty("message", "Registration success. Check your Email");

            }        
            s.close();   
        }
        String responseText = gson.toJson(responseObject);
        response.setContentType("application/json");
        response.getWriter().write(responseText);
   
    }

}
