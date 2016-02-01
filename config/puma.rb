application_path = '/var/www/vivotek-lottery-mobile-query-version'
directory application_path
workers Integer(ENV['WEB_CONCURRENCY'] || 48)
threads_count = Integer(48)
threads threads_count, threads_count

preload_app!

rackup      DefaultRackup
port        ENV['PORT']     ||  8412
environment ENV['RACK_ENV'] || 'development'

stdout_redirect "#{application_path}/log/puma.stdout.log", "#{application_path}/log/puma.stderr.log"
on_worker_boot do
end

