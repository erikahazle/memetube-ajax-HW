require 'sinatra'
require 'sinatra/reloader' if development?
require 'pg'
require 'pry'

get '/' do
  sql = ("select * from videos offset floor (random() * (select count(*) from videos)) limit 1;")
  @video = run_sql(sql).first
  erb :index
end

get '/videos' do
  sql = "SELECT * FROM videos"
  @library = run_sql(sql)
  erb :videos
end

get '/videos/new' do
  erb :new
end

post '/videos' do
  sql = "INSERT INTO videos (title, description, url, genre) VALUES ('#{params['title']}', '#{params['description']}', '#{params['url']}', '#{params['genre']}')"
  run_sql(sql)
  redirect to ('/videos')
end

get '/videos/:id' do
  sql = "SELECT * FROM videos WHERE id=#{params[:id]}"
  @video = run_sql(sql).first
  erb :show
end

get '/videos/:id/edit' do
  sql = "SELECT * FROM videos WHERE id=#{params[:id]}"
  @video = run_sql(sql).first
  erb :edit
end

post '/videos/:id' do
  sql = "UPDATE videos SET title = '#{params['title']}', description = '#{params['description']}', url = '#{params['url']}', genre = '#{params['genre']}' WHERE id=#{params[:id]}"
  run_sql(sql)
  redirect to ("/videos/#{params[:id]}")
end

delete '/videos/:id/delete' do
  sql = "DELETE FROM videos WHERE id=#{params[:id]}"
  run_sql(sql)
  redirect to ("/videos")
end


private

def run_sql(sql)
  conn = PG.connect(dbname: 'video_library', host: 'localhost')
  begin
    result = conn.exec(sql)
  ensure
    conn.close
  end
end