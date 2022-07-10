## Ver  : 1
## Auth : Siddharth Nobell

from flask import Flask, make_response, flash
import logging
import pymysql as PyMySQL
from flask import request, jsonify, render_template, redirect, url_for, session
from time import localtime, strftime
import simplejson as json
from passlib.hash import sha256_crypt
from flask_login import LoginManager
import os

#logging and db conn


db_resto = PyMySQL.connect(host="127.0.0.1",user="root",password="123456",database="gully_resto_app")
 


app = Flask(__name__)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

#added new on 09 July 2022
#from flask import send_from_directory

#app.add_url_rule('/favicon.ico',redirect_to=url_for('static', filename='favicon.ico'))

#@app.route('/favicon.ico')
#def favicon():
#    return send_from_directory(os.path.join(app.root_path, 'static'),
#                               'favicon.ico', mimetype='image/vnd.microsoft.icon')

@login_manager.user_loader
def load_user(user_id):
    try:
        return User.query.get(user_id)
    except:
        return None


@app.route('/resto_profille')
def resto_profille():
    if not 'username' in session:
        return redirect(url_for('login'))
    cursor = db_resto.cursor()
    cursor.execute("select r_id, r_name, contact_no,email,slot,opens,closes,type,address,v_id from vtbl_resturants where v_id='"+str(session['v_id'])+"'")
    data_restos = cursor.fetchall()
    restos = {}
    for row in data_restos:
        restos.update({row[0]:row[1]})
    session['returants'] = restos
    cursor.close()
    return render_template('resto_profille.html', user=session['username'],data = data_restos)
    #return 'Pollution API Engine Running'


@app.route('/glyresto/<int:r_id>',methods=['GET','POST'])
def my_form(r_id):
    if not 'username' in session:
        return redirect(url_for('login'))
    if request.method == 'GET':       
        if r_id != 0:
            cursor = db_resto.cursor()
            cursor.execute("select r_id,r_name,contact_no,email,slot,opens,closes,type,address from gully_food.vtbl_resturants where r_id="+str(r_id)+" and is_active='Y'")
            data_resto = cursor.fetchall()
            cursor.close()
        
            if len(data_resto) > 0:
                session['r_id'] = data_resto[0][0]
                return render_template('glyresto.html',user=session['username'], data = data_resto)
        else:
            return render_template('glyresto.html',user=session['username'],data = None)
    else:
        shop_name = request.form['shop_name']
        contact = request.form['contact']
        email = request.form['email']
        slot = request.form['slot']
        opens = request.form['opens']
        closes = request.form['closes']
        type = request.form['type']
        address = request.form['address']
        cursor = db_resto.cursor()
        if r_id != 0:
            cursor.execute("insert into vtbl_resturants_history select * from vtbl_resturants where is_active='Y' and r_id='"+str(r_id)+"'")
            cursor.execute("delete from vtbl_resturants where is_active='Y' and r_id='"+str(r_id)+"'")
            cursor.execute("insert into vtbl_resturants(r_id,r_name,contact_no,email,slot,opens,closes,type,address,v_id,is_active) values("+str(r_id)+",'"+str(shop_name)+"','"+str(contact)+"','"+str(email)+"','"+str(slot)+"','"+str(opens)+"','"+str(closes)+"','"+str(type)+"','"+str(address)+"',"+str(session['v_id'])+",'Y')")
        else:
            cursor.execute("insert into vtbl_resturants(r_name,contact_no,email,slot,opens,closes,type,address,v_id,is_active) values('"+str(shop_name)+"','"+str(contact)+"','"+str(email)+"','"+str(slot)+"','"+str(opens)+"','"+str(closes)+"','"+str(type)+"','"+str(address)+"',"+str(session['v_id'])+",'Y')")
            
        cursor.close()
        db_resto.commit()
        return redirect(url_for('resto_profille'))
 

# Route for handling the login page logic
@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        if request.form['username'] is not None and request.form['password'] is not None:
            cursor = db_resto.cursor()
            print('-----------------------')
            print(request.form['username'])
            print(request.form['password'])
            print(sha256_crypt.encrypt(request.form['password']))
            print('-----------------------')
            cursor.execute("select nick_name, password, v_id from vtbl_users where email='"+str(request.form['username'])+"'")
            #cursor.execute("select nick_name from vtbl_users where email='w@w.com' and password='$5$rounds=535000$SNzBmzvuSPWQIf2Z$yjDsbk.KO7b4FhdBJY1k.jhKAMuZY6hRl7KdtB0QsU7'")
            data_username = cursor.fetchall()
            cursor.close()
            print(data_username)
            if len(data_username) > 0:
                if sha256_crypt.verify(request.form['password'], data_username[0][1]):
                    session['logged_in'] = True
                    session['username'] = data_username[0][0].capitalize()
                    session['v_id'] = data_username[0][2]
                    print('--------####debug1####-------')
                    print(session['v_id'])
                    return redirect(url_for('resto_profille'))
            else:
                error = 'Invalid username or password'
        else:
            return redirect(url_for('my_form_post'))
    return render_template('login.html', error=error)



# Route for handling the login page logic
@app.route('/registration', methods=['GET', 'POST'])
def registration():
    #error = None
    if request.method == 'POST':
        n_name = request.form['n_name']
        email = request.form['email']
        pwd = request.form['pwd']
        psw_repeat = request.form['psw_repeat']
        
        cursor = db_resto.cursor()
        count = cursor.execute("select * from  vtbl_users where email='"+str(email)+"'")
        print(count)
        if count > 0:
            cursor.close()
            return render_template("registration.html", registration=['registration'], error = 'Email already registered, reset password  to login Or use another email')        
        
        
        if pwd == psw_repeat:
            try:
                cursor = db_resto.cursor()
                cursor.execute("insert into vtbl_users(nick_name,email,password,updated_at,is_active) values('"+str(n_name)+"','"+str(email)+"','"+str(sha256_crypt.encrypt(pwd))+"','"+str(strftime("%Y-%m-%d %H:%M:%S", localtime()))+"','Y')")
                cursor.close()
                db_resto.commit()
                return redirect(url_for('login'))
            except:
                return render_template("registration.html", registration=['registration'])
        else:
            #flash('Password Mismatch. Please try again')
            return render_template("registration.html", registration=['registration'])
    else:
        return render_template('registration.html')
    return render_template('registration.html')



@app.route('/resto_menu/<int:i_id>',methods=['GET','POST'])
def resto_menu(i_id):
    if not 'username' in session:
        return redirect(url_for('login'))
    print('---------Inside resto menu---------')    
    #print(i_id)
    #print(session['returants'].keys())
    if request.method == 'GET':  
        if i_id == 0:
            cursor = db_resto.cursor()
            data_menus = ()
            for resto in session['returants'].keys():
                #print(session['returants'][resto])
                cursor.execute("select * from vtbl_menu where v_id="+str(session['v_id'])+" and r_id="+str(resto))
                data_menu = cursor.fetchall()
                print(len(data_menu))
                print(data_menu)
                if len(data_menu) == 0:
                    data_menu = (session['returants'][resto].capitalize(),) + tuple((0,session['v_id'],resto,),)
                    print('--------------')
                    print(data_menu)
                    print('--------------')
                    print(len(data_menu))
                    print('--------------')
                else:
                    data_menu = (session['returants'][resto].capitalize(),) + (data_menu,)
                data_menus += (data_menu,)
            cursor.close()
            print(len(data_menus))
            print(data_menus)
            #here default len in 1 as (('Animikhs kitchen', ()),)
            if len(data_menus) > 1:
                return render_template('resto_menu.html', user=session['username'],data = data_menus)
            else:
                return render_template('resto_menu.html', user=session['username'],data = data_menus)
    else:
        food_item = request.form['food_item']
        food_desc = request.form['food_desc']
        food_type = request.form['food_type']
        price = request.form['price']
        sgst = request.form['sgst']
        cgst = request.form['cgst']
        i_id = request.form['i_id']
        v_id = request.form['v_id']
        r_id = request.form['r_id']
        #print(type(i_id))
        #print(v_id)
        #print(r_id)
        #print(food_item)
        #print(food_desc)
        #print(food_type)
        #print(price)
        if i_id == '0':
            #print('1111commit done---------')
            cursor = db_resto.cursor()
            cursor.execute("insert into vtbl_menu (v_id,r_id,name,`desc`,price,sgst,cgst,`type`,is_active) VALUES("+str(v_id)+","+str(r_id)+",'"+str(food_item)+"','"+str(food_desc)+"',"+str(price)+","+str(sgst)+","+str(cgst)+",'"+str(food_type)+"','Y')")
            cursor.close()
            db_resto.commit()
            #print('commit done---------')
            return redirect(url_for('resto_menu',i_id=0))
        else:
            cursor = db_resto.cursor()
            cursor.execute("insert into vtbl_menu_history select * from vtbl_menu where is_active='Y' and i_cd='"+str(i_id)+"'")
            cursor.execute("delete from vtbl_menu where is_active='Y' and i_cd='"+str(i_id)+"'")
            cursor.execute("insert into vtbl_menu(i_cd,v_id,r_id,name,`desc`,price,sgst,cgst,`type`,is_active) VALUES("+str(i_id)+","+str(v_id)+","+str(r_id)+",'"+str(food_item)+"','"+str(food_desc)+"',"+str(price)+","+str(sgst)+","+str(cgst)+",'"+str(food_type)+"','Y')")
            cursor.close()
            db_resto.commit()
            print('commit done---------')
            return redirect(url_for('resto_menu',i_id=0))




# Route for handling the login page logic
@app.route('/logout', methods=['GET', 'POST'])
def logout():
    session.pop('username', None)
    session.pop('logged_in', None)
    #clear the session variable
    return redirect(url_for('login'))

@app.route("/")
def pre_login():
    return redirect(url_for('login'))

if __name__ == '__main__':
   app.secret_key = 'aabbccsseeff@1122334455'
   #app.run(host='0.0.0.0',debug=True,port='8080')
   app.run(debug=True,port='5000')
