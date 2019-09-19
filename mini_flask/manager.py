from application import app,manager
import www

def main():
    # app.logger.info(app.config['SQLALCHEMY_DATABASE_URI'])
    app.run()
    # manager.run()

if __name__ =='__main__':
    try:
        import sys
        sys.exit(main())
    except Exception as e:
        app.logger.error(e)
